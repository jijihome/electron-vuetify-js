const fs = require('fs');
const path = require('path');

/**
 * 读取并解析 JSON 配置文件
 *
 * @description
 * 该函数会根据运行环境选择不同的配置文件读取策略：
 * - 开发环境 (NODE_ENV === 'development')：从 assets/config.json 读取
 * - 生产环境：从应用运行目录读取指定的配置文件
 *
 * @param {string|string[]} [configPaths=['config.json']] 配置文件路径或路径数组
 * @returns {Object} 解析后的配置对象
 */
function json_读取(configPaths = ['config.json']) {
  // 确保configPaths是数组
  const paths = Array.isArray(configPaths) ? configPaths : [configPaths];

  // 根据环境确定配置文件搜索路径
  const searchPaths =
    process.env.NODE_ENV === 'development'
      ? [path.join(__dirname, '../../../assets/config.json')]
      : paths.map((configPath) => (path.isAbsolute(configPath) ? configPath : path.join(process.cwd(), configPath)));

  for (const fullPath of searchPaths) {
    try {
      if (fs.existsSync(fullPath)) {
        const configFile = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(configFile);
      }
    } catch (error) {
      console.error(`读取配置文件失败 ${fullPath}:`, error);
      throw error;
    }
  }

  throw new Error('未找到有效的配置文件');
}

module.exports = {
  json_读取,
};
