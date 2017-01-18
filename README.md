## 项目结构


## 依赖库说明：

>
+ gulp-rev 解决网页静态资源缓存问题 (把静态文件名改成hash的形式)
+ gulp-rev-collector 到线上环境线，用来配合gulp-rev使用，替换 HTML 中的路径
+ gulp-sync 解决gulp任务异步问题
+ fetch.js 用于H5中 api对接
+ sizzle.min.js 用于操控DOM元素 （ 轻量级 ）

## 样式的适配问题：
1. pxtorem
    #### 适合移动端开发
    ##### pxtorem 是前端自动化配置非常好用的库，将less或者css文件里的 px属性全部转换为rem
    ##### document.documentElement.style.fontSize = window.innerWidth/3.75 + 'px’;
    ##### 这里的3.75是用来适配iPhone6下的样式，只需要在iPhone6下写好页面，其他屏幕尺寸实现自动缩放

    ``` javascript
        pxtorem({
          // index.html 中需要定义body最开始的font-size大小，这里root_value是100，那么1rem=100px;
          root_value: 100,
          replace: true,
          // 对指定的属性进行px to rem
          // 特定地方的属性不希望px to rem时候, px->Px 后不会 to rem
          prop_white_list: ['font', 'font-size', 'line-height',
          'letter-spacing', 'width', 'height', 'margin', 'padding'],
        })
    ```
    >
    #### 特别注意: inline 或者 inline-block 属性
    #### 未申明line-height情况下，拥有上述属性的元素会自动继承父级元素的font-size,可能会出现元素高度显示的bug
    #### 解决办法: 设置改元素的line-height
2. autoprefixer
    #### 移动端或者pc端都适用
    ##### 对弹性布局 flex 属性以及一些css3特性进行不同内核浏览器的适配，作兼容性处理

    ``` javascript
        autoprefixer({
          // 对兼容设备版本号的设置
          browsers: ['last 2 versions', 'iOS 7', 'Android 4.2']
        }),
    ```
3. normalize.css
   #### 移动端或者pc端都适用
   #### 用来统一不同浏览器初始化样式 （不同浏览器会附带不同样式）

# 资源加载：

```
    图片和音乐都需要压缩（每张图片尽量控制在100kb左右）
```

# 线上业务：
```
    需要微信转发和分享量 （调用微信接口）
    浏览量 （eg: 百度统计）
```

---
# 安装依赖文件

```
yarn install
npm install
```

# 实时编译静态资源

```
npm run watch
```
# 编译静态资源到线上环境

```
npm run build
```
