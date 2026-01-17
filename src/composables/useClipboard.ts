/**
 * 剪贴板操作的可复用组合式函数
 * 提供剪贴板读写功能和浏览器兼容性检测
 * 
 * 验证: 需求 4.1, 4.2, 4.3, 4.4, 4.5
 */
export function useClipboard() {
  /**
   * 检查浏览器是否支持 Clipboard API
   * @returns 是否支持剪贴板操作
   * @example
   * if (isSupported()) {
   *   // 可以使用剪贴板功能
   * }
   * 
   * 验证: 需求 4.1
   */
  const isSupported = (): boolean => {
    return (
      typeof navigator !== 'undefined' &&
      typeof navigator.clipboard !== 'undefined' &&
      typeof navigator.clipboard.readText === 'function' &&
      typeof navigator.clipboard.writeText === 'function'
    )
  }

  /**
   * 从剪贴板读取文本
   * @returns Promise<string> 剪贴板中的文本内容
   * @throws {Error} 如果浏览器不支持或用户拒绝权限
   * @example
   * try {
   *   const text = await readFromClipboard()
   *   console.log('剪贴板内容:', text)
   * } catch (error) {
   *   console.error('读取失败:', error)
   * }
   * 
   * 验证: 需求 4.1, 4.2
   */
  const readFromClipboard = async (): Promise<string> => {
    if (!isSupported()) {
      throw new Error('浏览器不支持剪贴板 API')
    }

    try {
      const text = await navigator.clipboard.readText()
      return text
    } catch (error) {
      // 处理权限被拒绝或其他错误
      if (error instanceof Error) {
        throw new Error(`读取剪贴板失败: ${error.message}`)
      }
      throw new Error('读取剪贴板失败')
    }
  }

  /**
   * 将文本写入剪贴板
   * @param text - 要写入剪贴板的文本
   * @returns Promise<void>
   * @throws {Error} 如果浏览器不支持或写入失败
   * @example
   * try {
   *   await writeToClipboard('Hello World')
   *   console.log('复制成功')
   * } catch (error) {
   *   console.error('复制失败:', error)
   * }
   * 
   * 验证: 需求 4.1
   */
  const writeToClipboard = async (text: string): Promise<void> => {
    if (!isSupported()) {
      throw new Error('浏览器不支持剪贴板 API')
    }

    if (typeof text !== 'string') {
      throw new Error('写入内容必须是字符串')
    }

    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      // 处理权限被拒绝或其他错误
      if (error instanceof Error) {
        throw new Error(`写入剪贴板失败: ${error.message}`)
      }
      throw new Error('写入剪贴板失败')
    }
  }

  /**
   * 从剪贴板读取并验证文本
   * 提供更安全的读取方式，包含错误处理
   * @returns Promise<{ success: boolean, text: string, error?: string }>
   * @example
   * const result = await readFromClipboardSafe()
   * if (result.success) {
   *   console.log('读取成功:', result.text)
   * } else {
   *   console.error('读取失败:', result.error)
   * }
   * 
   * 验证: 需求 4.2, 4.5
   */
  const readFromClipboardSafe = async (): Promise<{
    success: boolean
    text: string
    error?: string
  }> => {
    if (!isSupported()) {
      return {
        success: false,
        text: '',
        error: '浏览器不支持剪贴板 API'
      }
    }

    try {
      const text = await navigator.clipboard.readText()
      return {
        success: true,
        text
      }
    } catch (error) {
      let errorMessage = '读取剪贴板失败'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      return {
        success: false,
        text: '',
        error: errorMessage
      }
    }
  }

  /**
   * 将文本写入剪贴板（安全版本）
   * 提供更安全的写入方式，包含错误处理
   * @param text - 要写入剪贴板的文本
   * @returns Promise<{ success: boolean, error?: string }>
   * @example
   * const result = await writeToClipboardSafe('Hello World')
   * if (result.success) {
   *   console.log('复制成功')
   * } else {
   *   console.error('复制失败:', result.error)
   * }
   * 
   * 验证: 需求 4.5
   */
  const writeToClipboardSafe = async (text: string): Promise<{
    success: boolean
    error?: string
  }> => {
    if (!isSupported()) {
      return {
        success: false,
        error: '浏览器不支持剪贴板 API'
      }
    }

    if (typeof text !== 'string') {
      return {
        success: false,
        error: '写入内容必须是字符串'
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      return {
        success: true
      }
    } catch (error) {
      let errorMessage = '写入剪贴板失败'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * 复制文本到剪贴板（便捷方法）
   * 这是 writeToClipboard 的别名，提供更直观的命名
   * @param text - 要复制的文本
   * @returns Promise<void>
   * @example
   * await copyToClipboard('Hello World')
   * 
   * 验证: 需求 4.1
   */
  const copyToClipboard = async (text: string): Promise<void> => {
    return writeToClipboard(text)
  }

  /**
   * 从剪贴板粘贴文本（便捷方法）
   * 这是 readFromClipboard 的别名，提供更直观的命名
   * @returns Promise<string>
   * @example
   * const text = await pasteFromClipboard()
   * 
   * 验证: 需求 4.2
   */
  const pasteFromClipboard = async (): Promise<string> => {
    return readFromClipboard()
  }

  return {
    // 核心功能
    isSupported,
    readFromClipboard,
    writeToClipboard,
    
    // 安全版本（包含错误处理）
    readFromClipboardSafe,
    writeToClipboardSafe,
    
    // 便捷别名
    copyToClipboard,
    pasteFromClipboard
  }
}

/**
 * useClipboard 返回类型
 */
export type UseClipboardReturn = ReturnType<typeof useClipboard>
