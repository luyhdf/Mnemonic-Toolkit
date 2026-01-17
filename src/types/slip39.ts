/**
 * SLIP39分片相关类型定义
 */

/**
 * 组配置
 */
export interface GroupConfig {
  threshold: number  // 组内阈值
  shares: number     // 分片数量
}

/**
 * SLIP39配置
 */
export interface SLIP39Config {
  groupThreshold: number    // 组阈值 (1-16)
  groups: GroupConfig[]     // 组配置数组
  password?: string         // 可选密码
}

/**
 * 分片生成结果
 */
export interface ShareGenerationResult {
  shares: string[]          // 生成的分片数组
  groupThreshold: number    // 组阈值
  timestamp: number         // 生成时间戳
}

/**
 * 分片恢复结果
 */
export interface ShareRecoveryResult {
  mnemonic: string          // 恢复的BIP39助记词
  success: boolean          // 是否成功
  error?: string           // 错误信息（如果失败）
}

/**
 * 分片验证结果
 */
export interface ShareValidation {
  isValid: boolean         // 分片是否有效
  errors: string[]         // 错误信息列表
}

/**
 * 分片信息
 */
export interface ShareInfo {
  groupId?: number         // 组ID
  groupThreshold?: number  // 组阈值
  groupCount?: number      // 组数量
  memberIndex?: number     // 成员索引
  memberThreshold?: number // 成员阈值
}
