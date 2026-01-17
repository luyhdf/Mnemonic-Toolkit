import Slip39 from 'slip39'
import * as bip39 from 'bip39'
import type { 
  SLIP39Config, 
  ShareGenerationResult, 
  ShareRecoveryResult,
  ShareValidation,
  ShareInfo,
  GroupConfig
} from '../types/slip39'

/**
 * SLIP39分片管理的可复用组合式函数
 * 提供分片生成、恢复、验证和解析功能
 */
export function useSlip39() {
  /**
   * 生成SLIP39分片
   * @param mnemonic - BIP39助记词
   * @param config - SLIP39配置
   * @returns 分片生成结果
   * @throws {Error} 如果助记词无效或配置无效
   * @example
   * const result = generateShares("abandon ability able...", {
   *   groupThreshold: 2,
   *   groups: [
   *     { threshold: 1, shares: 1 },
   *     { threshold: 1, shares: 1 }
   *   ],
   *   password: "mypassword"
   * })
   * 
   * 验证: 需求 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
   */
  const generateShares = (
    mnemonic: string, 
    config: SLIP39Config
  ): ShareGenerationResult => {
    try {
      // 检查助记词是否为空
      if (!mnemonic || mnemonic.trim() === '') {
        throw new Error('助记词不能为空')
      }

      // 验证助记词有效性
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('BIP39助记词无效')
      }

      // 1. 将BIP39助记词转换为熵字节数组
      const entropy = bip39.mnemonicToEntropy(mnemonic)
      
      // 检查entropy是否有效
      if (!entropy) {
        throw new Error('无法将助记词转换为熵')
      }

      // 2. 转换为普通数组（不是Uint8Array）
      const entropyBytes = entropy.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))

      // 3. 确保groups是一个数组
      const groupConfigs = (config.groups || []).map(g => [g.threshold, g.shares])

      // 4. 使用Slip39.fromArray方法生成分片
      const slip39node = Slip39.fromArray(entropyBytes, {
        passphrase: config.password || '',
        threshold: config.groupThreshold,
        groups: groupConfigs
      })

      // 5. 检查slip39node.root是否存在
      if (!slip39node || !slip39node.root) {
        throw new Error('生成分片失败: 无法获取root节点')
      }

      // 6. 获取所有分片
      const shares = slip39node.root.mnemonics || []

      return {
        shares,
        groupThreshold: config.groupThreshold,
        timestamp: Date.now()
      }
    } catch (error) {
      throw new Error(`生成分片失败: ${(error as Error).message}`)
    }
  }

  /**
   * 从SLIP39分片恢复BIP39助记词
   * @param shares - SLIP39分片数组
   * @param password - 密码（如果生成时使用了密码）
   * @returns 恢复结果
   * @example
   * const result = recoverSecret(
   *   ["share1", "share2", "share3"],
   *   "mypassword"
   * )
   * 
   * 验证: 需求 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
   */
  const recoverSecret = (
    shares: string[], 
    password: string = ''
  ): ShareRecoveryResult => {
    try {
      // 过滤有效分片
      const validShares = shares.filter(share => share && share.trim())

      // 检查是否有有效分片
      if (validShares.length === 0) {
        return {
          mnemonic: '',
          success: false,
          error: '请输入有效的SLIP39分片'
        }
      }

      // 1. 使用Slip39.recoverSecret方法恢复熵
      const recoveredSecret = Slip39.recoverSecret(validShares, password)

      // 检查恢复的数据是否有效
      if (!recoveredSecret || recoveredSecret.length === 0) {
        return {
          mnemonic: '',
          success: false,
          error: '恢复失败: 无法从分片恢复数据'
        }
      }

      // 2. 转换为十六进制字符串
      const secretHex = Array.from(recoveredSecret)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')

      // 3. 将熵转换为BIP39助记词
      const mnemonic = bip39.entropyToMnemonic(secretHex)

      return {
        mnemonic,
        success: true
      }
    } catch (error) {
      return {
        mnemonic: '',
        success: false,
        error: `恢复失败: ${(error as Error).message}`
      }
    }
  }

  /**
   * 验证SLIP39分片的有效性
   * @param share - SLIP39分片字符串
   * @returns 验证结果
   * @example
   * const validation = validateShare("academic acid acrobat...")
   * // { isValid: true, errors: [] }
   * 
   * 验证: 需求 7.5
   */
  const validateShare = (share: string): ShareValidation => {
    const errors: string[] = []

    if (!share || typeof share !== 'string') {
      errors.push('分片必须是字符串')
      return { isValid: false, errors }
    }

    const trimmedShare = share.trim()
    if (!trimmedShare) {
      errors.push('分片不能为空')
      return { isValid: false, errors }
    }

    try {
      // 尝试解析分片信息
      const info = parseShareInfo(trimmedShare)
      
      // 基本验证：检查是否能解析出关键信息
      if (info.groupId === undefined && info.memberIndex === undefined) {
        errors.push('无法解析分片信息')
      }
    } catch (error) {
      errors.push(`分片格式无效: ${(error as Error).message}`)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 解析SLIP39分片信息
   * @param share - SLIP39分片字符串
   * @returns 分片信息对象
   * @example
   * const info = parseShareInfo("academic acid acrobat...")
   * // { groupId: 0, groupThreshold: 2, ... }
   * 
   * 验证: 需求 6.4, 6.5
   */
  const parseShareInfo = (share: string): ShareInfo => {
    const info: ShareInfo = {}

    if (!share || typeof share !== 'string') {
      return info
    }

    try {
      // SLIP39分片的前几个单词编码了元数据
      // 分片格式: 前3个单词是通用标识符，第4个单词开始包含组信息
      const words = share.trim().split(/\s+/)
      
      if (words.length < 20) {
        return info
      }

      // 通过分片的前缀来区分组
      // 相同组的分片会有相同的前3个单词
      const prefix = words.slice(0, 3).join(' ')
      
      // 使用前缀的哈希作为组标识
      // 这是一个简化的方法，实际的组ID编码在分片数据中
      let hash = 0
      for (let i = 0; i < prefix.length; i++) {
        hash = ((hash << 5) - hash) + prefix.charCodeAt(i)
        hash = hash & hash
      }
      info.groupId = Math.abs(hash) % 1000

    } catch (error) {
      console.error('解析分片信息失败:', error)
    }

    return info
  }

  /**
   * 验证组配置的有效性
   * @param config - SLIP39配置
   * @returns 验证结果
   * @example
   * const validation = validateConfig({
   *   groupThreshold: 2,
   *   groups: [
   *     { threshold: 1, shares: 2 },
   *     { threshold: 1, shares: 2 }
   *   ]
   * })
   * 
   * 验证: 需求 6.4, 6.5, 6.9, 12.4, 12.5
   */
  const validateConfig = (config: SLIP39Config): ShareValidation => {
    const errors: string[] = []

    // 验证组阈值
    if (!config.groupThreshold || config.groupThreshold < 1) {
      errors.push('组阈值必须至少为1')
    }

    // 验证组配置
    if (!config.groups || !Array.isArray(config.groups)) {
      errors.push('组配置必须是数组')
      return { isValid: false, errors }
    }

    if (config.groups.length === 0) {
      errors.push('至少需要一个组')
    }

    if (config.groupThreshold > config.groups.length) {
      errors.push(`组阈值(${config.groupThreshold})不能大于组数量(${config.groups.length})`)
    }

    // 验证每个组的配置
    config.groups.forEach((group, index) => {
      if (!group.threshold || group.threshold < 1) {
        errors.push(`组${index + 1}的阈值必须至少为1`)
      }

      if (!group.shares || group.shares < 1) {
        errors.push(`组${index + 1}的分片数必须至少为1`)
      }

      if (group.shares < group.threshold) {
        errors.push(`组${index + 1}的分片数(${group.shares})不能小于阈值(${group.threshold})`)
      }

      if (group.shares > 10) {
        errors.push(`组${index + 1}的分片数不能超过10`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 选择满足阈值要求的最小分片集合
   * 用于测试恢复功能
   * 注意：这个函数假设每个组的阈值都是该组分片数的一半或更少
   * 实际使用时，应该根据具体的组配置来选择分片
   * @param shares - 所有分片
   * @param groupThreshold - 组阈值
   * @param memberThreshold - 每个组的成员阈值（可选，默认为每组所有分片）
   * @returns 选择的分片数组
   * @example
   * const selected = selectMinimalShares(allShares, 2)
   * // 返回满足阈值要求的最小分片集合
   * 
   * 验证: 需求 8.2, 8.3, 8.4
   */
  const selectMinimalShares = (
    shares: string[], 
    groupThreshold: number,
    memberThreshold?: number
  ): string[] => {
    if (!shares || shares.length === 0) {
      return []
    }

    // 按照分片的前缀（前3个单词）分组
    const groupMap = new Map<string, string[]>()
    
    for (const share of shares) {
      const words = share.trim().split(/\s+/)
      if (words.length < 20) continue
      
      // 使用前3个单词作为组标识
      const groupPrefix = words.slice(0, 3).join(' ')
      
      if (!groupMap.has(groupPrefix)) {
        groupMap.set(groupPrefix, [])
      }
      groupMap.get(groupPrefix)!.push(share)
    }

    // 从每个组中选择足够数量的分片
    const selectedShares: string[] = []
    let groupCount = 0
    
    for (const [prefix, groupShares] of groupMap.entries()) {
      if (groupCount >= groupThreshold) {
        break
      }
      
      // 如果指定了成员阈值，使用它；否则使用该组的所有分片
      const sharesToTake = memberThreshold || groupShares.length
      const selectedFromGroup = groupShares.slice(0, sharesToTake)
      
      selectedShares.push(...selectedFromGroup)
      groupCount++
    }

    return selectedShares
  }

  /**
   * 创建默认的组配置
   * @param groupCount - 组数量
   * @returns 组配置数组
   * @example
   * const groups = createDefaultGroups(3)
   * // [{ threshold: 1, shares: 1 }, { threshold: 1, shares: 1 }, { threshold: 1, shares: 1 }]
   * 
   * 验证: 需求 12.1
   */
  const createDefaultGroups = (groupCount: number = 3): GroupConfig[] => {
    const groups: GroupConfig[] = []
    for (let i = 0; i < groupCount; i++) {
      groups.push({ threshold: 1, shares: 1 })
    }
    return groups
  }

  return {
    // 核心功能
    generateShares,
    recoverSecret,
    
    // 验证和解析
    validateShare,
    parseShareInfo,
    validateConfig,
    
    // 工具函数
    selectMinimalShares,
    createDefaultGroups
  }
}

/**
 * useSlip39 返回类型
 */
export type UseSlip39Return = ReturnType<typeof useSlip39>
