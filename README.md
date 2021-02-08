# vue3_zhihu

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


```
文档
http://docs.vikingship.xyz/
https://v5.getbootstrap.com/docs/5.0/forms/overview/?
```


```
父组件和子组件进行通信，父组件做事件监听，子组件发送事件
npm install --save mitt

```

```
npm install vue-router@next --save
```


```
安装vuex的4.0版本支持vue3
npm install vuex@next --save

```



```
安装markdown
https://github.com/markdown-it/markdown-it
npm install markdown-it --save

如果文件里找不到markdown库 可能不是.ts文件而是.js文件
找到shims-vue-d.ts文件加入一行 
declare module 'markdown-it'
```