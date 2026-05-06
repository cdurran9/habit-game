import { useState } from 'react'
import { Plus, Lock, Check, Trash, X, Gift } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { RewardClaimBurst } from '../components/animation/RewardClaimBurst'
import type { Reward, RewardPrerequisite } from '../types'
import { uuid } from '../lib/uuid'

function prereqLabel(prereq: RewardPrerequisite, stats: { id: string; abbreviation: string; name: string }[]): string {
  if (prereq.type === 'total_level') return `Total Level ${prereq.level}`
  const stat = stats.find(s => s.id === prereq.statId)
  return stat ? `${stat.abbreviation} Level ${prereq.level}` : `Level ${prereq.level}`
}

function isUnlocked(reward: Reward, stats: { id: string; level: number }[], totalLevel: number): boolean {
  return reward.prerequisites.every(prereq => {
    if (prereq.type === 'total_level') return totalLevel >= prereq.level
    const stat = stats.find(s => s.id === prereq.statId)
    return stat ? stat.level >= prereq.level : false
  })
}

interface NewRewardFormProps {
  onClose: () => void
}

function NewRewardForm({ onClose }: NewRewardFormProps) {
  const { data, dispatch } = useGame()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [prerequisites, setPrerequisites] = useState<RewardPrerequisite[]>([])
  const [prereqType, setPrereqType] = useState<'total_level' | string>('total_level')
  const [prereqLevel, setPrereqLevel] = useState('1')

  const inputClass = 'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 w-full'

  function addPrereq() {
    const level = Math.max(1, parseInt(prereqLevel) || 1)
    if (prereqType === 'total_level') {
      setPrerequisites(p => [...p, { type: 'total_level', level }])
    } else {
      setPrerequisites(p => [...p, { type: 'stat_level', statId: prereqType, level }])
    }
    setPrereqLevel('1')
  }

  function removePrereq(i: number) {
    setPrerequisites(p => p.filter((_, idx) => idx !== i))
  }

  function handleCreate() {
    if (!name.trim()) return
    const reward: Reward = {
      id: uuid(),
      name: name.trim(),
      description: description.trim(),
      prerequisites,
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_REWARD', reward })
    onClose()
  }

  const sortedStats = [...data.stats].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Name</label>
        <input
          className={inputClass}
          placeholder="Buy myself something nice…"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
      </div>

      <div>
        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-1.5">Description <span className="normal-case font-normal text-white/30">(optional)</span></label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          placeholder="Details…"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Prerequisites</label>

        {prerequisites.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-3">
            {prerequisites.map((p, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-sm">
                <span className="flex-1">{prereqLabel(p, sortedStats)}</span>
                <button onClick={() => removePrereq(i)} className="text-white/30 hover:text-white/60 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <select
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-white/30 flex-1"
            value={prereqType}
            onChange={e => setPrereqType(e.target.value)}
          >
            <option value="total_level">Total Level</option>
            {sortedStats.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 w-16"
            value={prereqLevel}
            onChange={e => setPrereqLevel(e.target.value)}
            placeholder="Lv"
          />
          <button
            onClick={addPrereq}
            className="px-3 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/15 hover:text-white text-sm transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!name.trim()}>Create Reward</Button>
      </div>
    </div>
  )
}

interface RewardCardProps {
  reward: Reward
  unlocked: boolean
  onClaim: () => void
  onDelete: () => void
}

function RewardCard({ reward, unlocked, onClaim, onDelete }: RewardCardProps) {
  const { data } = useGame()
  const claimed = !!reward.claimedAt
  const sortedStats = [...data.stats].sort((a, b) => a.order - b.order)
  const totalLevel = data.stats.reduce((sum, s) => sum + s.level, 0)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`p-4 rounded-xl border transition-colors ${
        claimed
          ? 'bg-white/3 border-white/5 opacity-50'
          : unlocked
          ? 'bg-white/7 border-white/15'
          : 'bg-white/3 border-white/5 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          claimed ? 'bg-green-500/20' : unlocked ? 'bg-amber-500/15' : 'bg-white/5'
        }`}>
          {claimed
            ? <Check size={16} weight="bold" className="text-green-400" />
            : unlocked
            ? <Gift size={16} weight="duotone" className="text-amber-300" />
            : <Lock size={16} weight="duotone" className="text-white/30" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-sm">{reward.name}</div>
          {reward.description && (
            <div className="text-white/50 text-xs mt-0.5">{reward.description}</div>
          )}

          {reward.prerequisites.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {reward.prerequisites.map((p, i) => {
                const met = p.type === 'total_level'
                  ? totalLevel >= p.level
                  : (data.stats.find(s => s.id === p.statId)?.level ?? 0) >= p.level
                return (
                  <span
                    key={i}
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      met
                        ? 'bg-green-500/10 border-green-500/20 text-green-300/70'
                        : 'bg-white/5 border-white/10 text-white/35'
                    }`}
                  >
                    {met ? '✓ ' : ''}{prereqLabel(p, sortedStats)}
                  </span>
                )
              })}
            </div>
          )}

          {claimed && reward.claimedAt && (
            <div className="text-white/30 text-xs mt-1.5">
              Claimed {new Date(reward.claimedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!claimed && unlocked && (
            <button
              onClick={onClaim}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
            >
              Claim
            </button>
          )}
          {!claimed && (
            <button
              onClick={onDelete}
              className="text-white/20 hover:text-white/50 transition-colors"
            >
              <Trash size={15} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function RewardsPage() {
  const { data, dispatch, claimReward } = useGame()
  const [showForm, setShowForm] = useState(false)
  const [burstActive, setBurstActive] = useState(false)

  const totalLevel = data.stats.reduce((sum, s) => sum + s.level, 0)

  const unclaimed = data.rewards.filter(r => !r.claimedAt)
  const claimed = data.rewards.filter(r => !!r.claimedAt)

  const available = unclaimed.filter(r => isUnlocked(r, data.stats, totalLevel))
  const locked = unclaimed.filter(r => !isUnlocked(r, data.stats, totalLevel))

  function handleClaim(id: string) {
    claimReward(id)
    setBurstActive(true)
    setTimeout(() => setBurstActive(false), 300)
  }

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE_REWARD', id })
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-2xl font-bold">Rewards</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium hover:bg-white/15 hover:text-white transition-colors"
        >
          <Plus size={16} /> New Reward
        </button>
      </div>

      {data.rewards.length === 0 && (
        <div className="text-center py-16 text-white/25">
          <Gift size={40} weight="duotone" className="mx-auto mb-3 opacity-50" />
          <div className="text-sm">No rewards yet. Add something to work toward.</div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {available.map(r => (
            <RewardCard
              key={r.id}
              reward={r}
              unlocked={true}
              onClaim={() => handleClaim(r.id)}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
          {locked.map(r => (
            <RewardCard
              key={r.id}
              reward={r}
              unlocked={false}
              onClaim={() => {}}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
          {claimed.map(r => (
            <RewardCard
              key={r.id}
              reward={r}
              unlocked={true}
              onClaim={() => {}}
              onDelete={() => {}}
            />
          ))}
        </AnimatePresence>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Reward">
        <NewRewardForm onClose={() => setShowForm(false)} />
      </Modal>

      <RewardClaimBurst active={burstActive} />
    </div>
  )
}
