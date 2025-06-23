'use client'
import { useRef, useState, useEffect } from 'react'

const items = ['🍒', '🍋', '🍇', '💎', '🔔', '🍀']
const ITEM_HEIGHT = 80
const COST_PER_SPIN = 10
const REWARD_ON_WIN = 50

export default function Roulette() {
  const winChancePercent = 50
  const winChance = winChancePercent / 100

  const [spinning, setSpinning] = useState(false)
  const [results, setResults] = useState<number[]>([0, 0, 0])
  const [finalResult, setFinalResult] = useState<string | null>(null)
  const [won, setWon] = useState(false)

  const offsets = useRef([0, 0, 0])
  const speeds = useRef([0, 0, 0])
  const stopped = useRef([false, false, false])
  const animationFrameId = useRef<number | null>(null)

  const [dummy, setDummy] = useState(0)
  const [lightsOn, setLightsOn] = useState(false)

  const [initialAmount, setInitialAmount] = useState<number | null>(null)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    let id: number
    if (spinning) {
      id = window.setInterval(() => {
        setLightsOn((v) => !v)
      }, 300)
    } else {
      setLightsOn(false)
    }
    return () => {
      clearInterval(id)
      setLightsOn(false)
    }
  }, [spinning])

  function animate() {
    let allStopped = true
    for (let i = 0; i < 3; i++) {
      if (!stopped.current[i]) {
        allStopped = false
        offsets.current[i] += speeds.current[i]
        if (offsets.current[i] >= items.length * ITEM_HEIGHT) {
          offsets.current[i] -= items.length * ITEM_HEIGHT
        }
      }
    }
    setDummy((d) => d + 1)
    if (!allStopped) {
      animationFrameId.current = requestAnimationFrame(animate)
    }
  }

  function generateResults(): number[] {
    if (Math.random() < winChance) {
      const winIndex = Math.floor(Math.random() * items.length)
      return [winIndex, winIndex, winIndex]
    }
    let res: number[]
    do {
      res = [
        Math.floor(Math.random() * items.length),
        Math.floor(Math.random() * items.length),
        Math.floor(Math.random() * items.length),
      ]
    } while (res[0] === res[1] && res[1] === res[2])
    return res
  }

  function stopColumn(colIndex: number, resultIndex: number) {
    speeds.current[colIndex] = 0
    stopped.current[colIndex] = true
    offsets.current[colIndex] = resultIndex * ITEM_HEIGHT
  }

  const spin = () => {
    if (spinning || balance < COST_PER_SPIN) return

    setSpinning(true)
    setFinalResult(null)
    setWon(false)

    const newResults = generateResults()
    setResults(newResults)
    setBalance((b) => b - COST_PER_SPIN)

    speeds.current = [40, 40, 40]
    stopped.current = [false, false, false]

    animationFrameId.current = requestAnimationFrame(animate)

    setTimeout(() => stopColumn(0, newResults[0]), 2200)
    setTimeout(() => stopColumn(1, newResults[1]), 3800)
    setTimeout(() => stopColumn(2, newResults[2]), 5400)

    setTimeout(() => {
      setSpinning(false)
      const isWin = newResults.every((r) => r === newResults[0])
      setFinalResult(isWin ? '🎉 Você ganhou!' : '😅 Tente novamente')
      setWon(isWin)
      if (isWin) {
        setBalance((b) => b + REWARD_ON_WIN)
      }
    }, 6000)
  }

  useEffect(() => {
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  if (initialAmount === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
        <h1 className="text-3xl font-bold mb-4">🎰 Comece a jogar</h1>
        <input
          type="number"
          placeholder="Digite o valor inicial"
          className="p-3 text-black rounded mb-4"
          onChange={(e) => {
            const val = parseInt(e.target.value)
            if (!isNaN(val)) setInitialAmount(val)
          }}
        />
        <button
          className="px-6 py-3 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
          onClick={() => {
            if (initialAmount !== null) setBalance(initialAmount)
          }}
        >
          Iniciar
        </button>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden
        ${!spinning && finalResult && !won ? 'animate-shake' : ''}
      `}
    >
      {/* Cabeçalho com saldo e lucro/prejuízo */}
      <div className="absolute top-6 left-6 text-sm sm:text-base bg-black/60 p-3 rounded-lg shadow-lg border border-yellow-500">
        <div>💰 Saldo: <strong>R$ {balance}</strong></div>
        <div>
          {initialAmount !== null && (
            <>
              {balance - initialAmount >= 0 ? (
                <span className="text-green-400">Lucro: R$ {balance - initialAmount}</span>
              ) : (
                <span className="text-red-400">Prejuízo: R$ {initialAmount - balance}</span>
              )}
            </>
          )}
        </div>
      </div>

      {won && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Luzes */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-0 right-0 flex justify-center space-x-6 pointer-events-none select-none"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full bg-yellow-400 filter drop-shadow-lg 
              transition-opacity duration-300
              ${lightsOn ? 'opacity-100' : 'opacity-30'}
              ${i % 2 === 0 ? 'animate-pulse' : 'animate-pulse delay-150'}
            `}
            style={{ animationDuration: '700ms' }}
          />
        ))}
      </div>

      <h1 className="text-4xl font-extrabold mb-6 tracking-wide drop-shadow-lg select-none">
        🎰 Caça-Níquel
      </h1>

      <div className="flex space-x-2 bg-gray-900 border-4 border-yellow-400 rounded-lg overflow-hidden p-4 shadow-lg z-10">
        {[0, 1, 2].map((colIndex) => (
          <div
            key={colIndex}
            className="w-24 overflow-hidden relative bg-black rounded"
            style={{ height: ITEM_HEIGHT * 3 }}
          >
            <div
              style={{
                transform: `translateY(-${offsets.current[colIndex]}px)`,
                transition: stopped.current[colIndex] ? 'transform 0.5s ease-out' : 'none',
              }}
              className="flex flex-col"
            >
              {[...items, ...items].map((item, i) => {
                const isWinning =
                  won && results[colIndex] === items.indexOf(item) && i % items.length === results[colIndex]
                return (
                  <div
                    key={i}
                    style={{ height: ITEM_HEIGHT }}
                    className={`flex justify-center items-center text-4xl select-none ${
                      isWinning ? 'animate-glow text-yellow-300' : ''
                    }`}
                  >
                    {item}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-8 px-12 py-4 bg-yellow-500 rounded-full font-extrabold text-black hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/60 z-10"
        aria-label="Girar a roleta"
      >
        {spinning ? <span className="animate-spin inline-block">&#9696;</span> : 'Girar'}
      </button>

      {finalResult && (
        <div
          className={`mt-8 text-3xl font-bold tracking-wide select-none z-10 
            ${won ? 'text-green-400 animate-bounce' : 'text-red-400'}
          `}
        >
          {finalResult}
        </div>
      )}

      <style jsx>{`
        .confetti {
          position: absolute;
          top: 0;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          animation: fall 2s linear infinite;
        }

        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-5px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes glow {
          0% {
            text-shadow: 0 0 2px #fff, 0 0 4px #ff0, 0 0 6px #ff0;
          }
          100% {
            text-shadow: 0 0 6px #fff, 0 0 12px #ff0, 0 0 18px #ff0;
          }
        }

        .animate-glow {
          animation: glow 1s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}
