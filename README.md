 <p align="center"><a href="http://vuescrolljs.yvescoding.org/"><img width="100" src="http://vuescrolljs.yvescoding.org/logo.png" /></a></p>
<h1 align="center">Vuescroll</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev"><img src="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev.png?style=shield" alt="Build Status"></a>
   <a href="https://codecov.io/github/YvesCoding/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/YvesCoding/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/YvesCoding/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

<p align="center">
  <a href="https://github.com/YvesCoding/vuescroll-issue-list-demo" target="_blank"><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/show1.gif?raw=true" width="400"  alt="Demo"/></a>
</p>

Vuescroll is a [full customizable scrollbar](https://vuescrolljs.yvescoding.org/demo/#customize-scrollbar) plugin based on Vue.js 2.X, it also spports [pull-to-refresh, push-to-load](https://vuescrolljs.yvescoding.org/demo/#pull-refresh-or-push-load) or [carousel](https://vuescrolljs.yvescoding.org/demo/#carousel).

_Vuescroll's compatibility is consistent with `Vue.js 2.X`._

## Documentation

- [Online Demo](http://vuescrolljs.yvescoding.org/demo/)

- [Get Started Guide](http://vuescrolljs.yvescoding.org/guide/getting-started.html)

- [Configurations](http://vuescrolljs.yvescoding.org/guide/configuration.html)

- [API](http://vuescrolljs.yvescoding.org/guide/api.html)

- [Event](http://vuescrolljs.yvescoding.org/guide/event.html)

- [Slot](http://vuescrolljs.yvescoding.org/guide/slot.html)

## Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <script src="https://unpkg.com/vue@2.5.17/dist/vue.js"></script>
    <script src="https://unpkg.com/vuescroll@4.9.0-beta.15/dist/vuescroll.js"></script>
    <link
      rel="stylesheet"
      href="https://unpkg.com/vuescroll@4.9.0-beta.15/dist/vuescroll.css"
    />
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

- My twitter: [@wangyi70991](https://twitter.com/wangyi70991?s=01)

* WeChat group:

 <img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/wx.png?raw=true" width="400" alt="Demo" style="max-width:100%;">

## License

**MIT**
