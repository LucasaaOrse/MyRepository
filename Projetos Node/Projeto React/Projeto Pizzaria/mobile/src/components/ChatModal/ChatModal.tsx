// components/ChatModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { socket } from '../../services/socket';
import { api } from '../../services/api';

interface ChatModalProps {
  roomId: string;       // sala do socket (order_id)
  tableNumber: number;  // só para exibir no cabeçalho
}

export type SenderType = "garcom" | "cozinha";

interface RawMessage {
  author: SenderType;
  message: string;
  timestamp: number;
}

export interface Message {
  id: string;
  content: string;
  sender: SenderType;
  timestamp: number;
}

export function ChatModal({ roomId, tableNumber }: ChatModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  // limpa badge quando abre
  useEffect(() => {
    if (modalVisible) {
      setHasUnread(false);
    }
  }, [modalVisible]);

  useEffect(() => {
    // carrega histórico
    api.get<RawMessage[]>(`/messages/${roomId}`)
      .then(res => {
        setChat(res.data.map(h => ({
          id: String(h.timestamp),
          content: h.message,
          sender: h.author,
          timestamp: h.timestamp
        })));
      })
      .catch(err => console.log("Erro ao buscar histórico:", err));

    // entra na sala
    socket.emit("joinRoom", { room: roomId });

    // recebe novas
    socket.on("newMessage", (raw: any) => {
      const incoming: Message = {
        id: String(raw.timestamp),
        content: raw.message,
        sender: raw.author,
        timestamp: raw.timestamp,
      };
      setChat(prev => [...prev, incoming]);

      // badge + pulse
      if (!modalVisible) {
        setHasUnread(true);
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.4, duration: 300, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      }
    });

    return () => {
      socket.off("newMessage");
      socket.emit("leaveRoom", { room: roomId });
    };
  }, [roomId, modalVisible]);

  function sendMessage() {
    if (!message.trim()) return;

    const ts = Date.now();
    const outgoing = {
      room: roomId,
      author: "garcom" as const,
      message,
      timestamp: ts
    };

    socket.emit("sendMessage", outgoing);
    setChat(prev => [
      ...prev,
      { id: String(ts), content: message, sender: "garcom", timestamp: ts }
    ]);
    setMessage('');
  }

  return (
    <>
      <TouchableOpacity style={styles.iconWrapper} onPress={() => setModalVisible(true)}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulse }] }]}>
          <Feather name="message-square" size={28} color="#fff" />
        </Animated.View>
        {hasUnread && <View style={styles.badge} />}
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.chatBox}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Chat Mesa {tableNumber}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={chat}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === 'garcom' ? styles.garcom : styles.cozinha
                  ]}
                >
                  <Text style={styles.messageText}>{item.content}</Text>
                </View>
              )}
              style={{ flex: 1 }}
            />

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Digite sua mensagem"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage}>
                <Feather name="send" size={24} color="#3fd1ff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    zIndex: 10,
  },
  iconContainer: {
    backgroundColor: '#3fd1ff',
    padding: 12,
    borderRadius: 50,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff4f4b',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  chatBox: {
    margin: 20,
    backgroundColor: '#1d1d2e',
    borderRadius: 10,
    padding: 16,
    height: '70%',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chatTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  garcom: {
    backgroundColor: '#3fd1ff',
    alignSelf: 'flex-end',
  },
  cozinha: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#101026',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#101026',
    borderRadius: 6,
    padding: 10,
    color: '#fff',
  },
});
