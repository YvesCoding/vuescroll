<a name="4.5.13"></a>
## 4.5.13 (2018-05-09)


### Bug Fixes

* indent ([0c31be8](https://github.com/wangyi7099/vuescroll/commit/0c31be8))
* internalscrollTop should default to 0 ([418b45a](https://github.com/wangyi7099/vuescroll/commit/418b45a))
* rail's borderradius cannot be dynamiclly set ([de6c4c2](https://github.com/wangyi7099/vuescroll/commit/de6c4c2))
* typo in readme ([057dfda](https://github.com/wangyi7099/vuescroll/commit/057dfda))
* typo in readme ([6955321](https://github.com/wangyi7099/vuescroll/commit/6955321))


### Features

* **api:** add preventDefault option ([70e1886](https://github.com/wangyi7099/vuescroll/commit/70e1886))


### Performance Improvements

* **touch:** optimize scroll experience ([53148ed](https://github.com/wangyi7099/vuescroll/commit/53148ed))



<a name="4.5.12"></a>
## 4.5.12 (2018-05-04)


### Bug Fixes

* error process when mode is 'slide' ([3eaa1ca](https://github.com/wangyi7099/vuescroll/commit/3eaa1ca))
* typo ([ff76b39](https://github.com/wangyi7099/vuescroll/commit/ff76b39))


### Features

* **api:** add zoomTo, zoomBy, getCurrentviewDom methods ([7769099](https://github.com/wangyi7099/vuescroll/commit/7769099))
* **paging:** add getCurrentPage, goToPage api for paging in slide mode ([a3e2478](https://github.com/wangyi7099/vuescroll/commit/a3e2478))



<a name="4.5.10"></a>
## 4.5.10 (2018-04-30)



<a name="4.5.9"></a>
## 4.5.9 (2018-04-30)


### Features

* add zooming options to enable zoom in slide mode or not ([ed0e4f3](https://github.com/wangyi7099/vuescroll/commit/ed0e4f3))



<a name="4.5.5"></a>
## 4.5.5 (2018-04-28)


### Performance Improvements

* set document select none when mouse is clicked ([5e24562](https://github.com/wangyi7099/vuescroll/commit/5e24562))



<a name="4.5.4"></a>
## 4.5.4 (2018-04-27)


### Bug Fixes

* resize event didn't trigger in FireFox ([dbb5908](https://github.com/wangyi7099/vuescroll/commit/dbb5908)), closes [#22](https://github.com/wangyi7099/vuescroll/issues/22)
* typo ([d89ec35](https://github.com/wangyi7099/vuescroll/commit/d89ec35))
* typo ([11da6a8](https://github.com/wangyi7099/vuescroll/commit/11da6a8))



<a name="4.5.2"></a>
## 4.5.2 (2018-04-26)



<a name="4.5.1"></a>
## 4.5.1 (2018-04-26)



<a name="4.5.0"></a>
# 4.5.0 (2018-04-26)


### Bug Fixes

* use internalscrollLeft in scrollTo api ([003be27](https://github.com/wangyi7099/vuescroll/commit/003be27))


### Features

* add scrollby api ([8161055](https://github.com/wangyi7099/vuescroll/commit/8161055))
* **core:** add pure-native mode that you can use native scrollbar in vuescroll ([8249b5d](https://github.com/wangyi7099/vuescroll/commit/8249b5d))



<a name="4.4.8"></a>
## 4.4.8 (2018-04-21)



<a name="4.4.7"></a>
## 4.4.7 (2018-04-21)



<a name="4.4.6"></a>
## 4.4.6 (2018-04-21)



<a name="4.4.5"></a>
## 4.4.5 (2018-04-21)



<a name="4.4.3"></a>
## 4.4.3 (2018-04-20)



<a name="4.3.3"></a>
## 4.3.3 (2018-04-20)



<a name="4.2.3"></a>
## 4.2.3 (2018-04-19)



<a name="4.2.2"></a>
## 4.2.2 (2018-04-17)



<a name="4.1.2"></a>
## 4.1.2 (2018-04-17)


### Bug Fixes

* record pos confilt ([6250c2b](https://github.com/wangyi7099/vuescroll/commit/6250c2b))



<a name="4.1.1"></a>
## 4.1.1 (2018-04-17)


### Bug Fixes

* a typo error in readme ([5f81713](https://github.com/wangyi7099/vuescroll/commit/5f81713))
* add a limit to scroll distance ([4c2220b](https://github.com/wangyi7099/vuescroll/commit/4c2220b))
* calculate scrollPanel's height wrongly while width isn't overflow ([81d7159](https://github.com/wangyi7099/vuescroll/commit/81d7159))
* called function wrongly (fix:[#4](https://github.com/wangyi7099/vuescroll/issues/4)) ([cf89320](https://github.com/wangyi7099/vuescroll/commit/cf89320))
* change condition to hBar instead of vBar ([1c88f26](https://github.com/wangyi7099/vuescroll/commit/1c88f26))
* dynamic set gutter, use es6 syntax to write code ([225c458](https://github.com/wangyi7099/vuescroll/commit/225c458))
* error calculate content's height ([c83a9b5](https://github.com/wangyi7099/vuescroll/commit/c83a9b5))
* error class name of hiding the bar ([ac938f5](https://github.com/wangyi7099/vuescroll/commit/ac938f5))
* error correct scrollPanel height ([2f9d70e](https://github.com/wangyi7099/vuescroll/commit/2f9d70e))
* error transform style ([ccd620c](https://github.com/wangyi7099/vuescroll/commit/ccd620c))
* hide default scrollbar ([83a3c48](https://github.com/wangyi7099/vuescroll/commit/83a3c48))
* judge if vue._isDestroyed to nextTick ([b1f56a6](https://github.com/wangyi7099/vuescroll/commit/b1f56a6))
* lot of bugs ([c6cb5fd](https://github.com/wangyi7099/vuescroll/commit/c6cb5fd))
* options: scrollContent padding not work(fix:[#6](https://github.com/wangyi7099/vuescroll/issues/6)) ([b3d2c87](https://github.com/wangyi7099/vuescroll/commit/b3d2c87))
* resize window scroll doesn't update ([9184bba](https://github.com/wangyi7099/vuescroll/commit/9184bba))
* some bugs ([e60f6eb](https://github.com/wangyi7099/vuescroll/commit/e60f6eb))
* typo ([3c5402f](https://github.com/wangyi7099/vuescroll/commit/3c5402f))
* typo ([f1958d4](https://github.com/wangyi7099/vuescroll/commit/f1958d4))
* typo of setting style of scrollPanel ([1cb3ecb](https://github.com/wangyi7099/vuescroll/commit/1cb3ecb))


### Features

* add mode options ([72443a6](https://github.com/wangyi7099/vuescroll/commit/72443a6))
* add native option ([699b068](https://github.com/wangyi7099/vuescroll/commit/699b068))
* add pull refresh ([4191c9a](https://github.com/wangyi7099/vuescroll/commit/4191c9a))
* add zoom support to non-native mode ([d439e4c](https://github.com/wangyi7099/vuescroll/commit/d439e4c))
* merge code ([d0bfd38](https://github.com/wangyi7099/vuescroll/commit/d0bfd38))
* rewrite  scrollContent and scrollRail to functional components ([63f243d](https://github.com/wangyi7099/vuescroll/commit/63f243d))
* sweak core code ([6f12e8d](https://github.com/wangyi7099/vuescroll/commit/6f12e8d))
* sweak the core architecture ([9fe86f9](https://github.com/wangyi7099/vuescroll/commit/9fe86f9))
* sync some feature between vuescroll and scroller ([5bae654](https://github.com/wangyi7099/vuescroll/commit/5bae654))
* update ([a11cc79](https://github.com/wangyi7099/vuescroll/commit/a11cc79))
* use jsx ([90f3139](https://github.com/wangyi7099/vuescroll/commit/90f3139))



