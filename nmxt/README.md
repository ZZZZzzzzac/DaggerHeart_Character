# 逆命仙途独立版

这是 nmxt 的独立运行包源码目录。

## 运行方式

### Windows

直接双击 `server.bat`，然后访问 http://localhost:8080 。

### 手动启动 HTTP 服务

在当前目录执行：

```bash
python -m http.server 8080
```

然后访问 http://localhost:8080 。

## 说明

- 角色数据保存在浏览器的 localStorage `nmxt_characterSheetData`。
- 导入 / 导出 JSON、打印 PDF、表格选择等功能都可以在独立目录下使用。
- 不需要根目录工程中的其它 HTML、CSS、JS 文件。
