 <p align="center"><a href="http://vuescrolljs.yvescoding.org/"><img width="100" src="http://vuescrolljs.yvescoding.org/logo.png" /></a></p>
<h1 align="center">Vuescroll</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev"><img src="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev.png?style=shield" alt="Build Status"></a> <a href="https://gitter.im/vuescroll/community"><img src="https://camo.githubusercontent.com/a3499d9c23589c104f3fdb46c7a9943719903fd2/68747470733a2f2f6261646765732e6769747465722e696d2f456c656d6546452f6d696e742d75692e737667" alt="chat on gitter"></a> 
   <a href="https://codecov.io/github/YvesCoding/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/YvesCoding/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/YvesCoding/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

<p align="center">
  <img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/show.gif?raw=true" width="800"  alt="Demo"/> 
</p>

Vuescroll is a scrollbar plugin based on Vue.js 2.X, it is very easy to use, no complex options and every options has its default value. Just wrap the content by `<vue-scroll>` and a custom scrollbar will show. It supports:

- Customizable scrollbar
- Pull-to-refresh, push-to-load
- Carousel

_Vuescroll's compatibility is the same as `Vue.js 2.X`._

## Demo

[Live Demo](https://vuescrolljs.yvescoding.org/demo) on the website.

## Documentation

For detailed docs, please see [Guide](https://vuescrolljs.yvescoding.org/guide) section on the website.

## Example in local

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <script src="https://unpkg.com/vue@2.5.17/dist/vue.js"></script>
    <script src="https://unpkg.com/vuescroll@4.10.2/dist/vuescroll.js"></script>
    <style>
      html,
      body {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #app {
        width: 100%;
        height: 100%;
        text-align: center;
      }

      #parent {
        width: 400px;
        height: 400px;
        display: inline-block;
      }

      #child {
        width: 800px;
        height: 800px;
        background: -webkit-linear-gradient(left top, red, blue);
        /* Safari 5.1 to 6.0 */
        background: -o-linear-gradient(bottom right, red, blue);
        /* Opera 11.1 to 12.0 */
        background: -moz-linear-gradient(bottom right, red, blue);
        /* Firefox 3.6 to 15 */
        background: linear-gradient(to bottom right, red, blue);
        /* 标准语法 */
      }
    </style>
  </head>

  <body>
    <div id="app">
      <div id="parent">
        <vue-scroll :ops="ops"> <div id="child"></div> </vue-scroll>
      </div>
    </div>
    <script>
      new Vue({
        el: '#app',
        data: {
          ops: {
            bar: {
              background: 'rgb(24, 144, 255)'
            },
            rail: {
              border: '1px solid #cecece',
              size: '20px'
            },
            scrollButton: {
              enable: true,
              background: '#cecece'
            }
          }
        }
      });
    </script>
  </body>
</html>
```

## Communication

- Tell me on my twitter: [@wangyi70991](https://twitter.com/wangyi70991?s=01)

- WeChat group:

 <img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/wx.png?raw=true" width="400" alt="Demo" style="max-width:100%;">

## License

**MIT**
