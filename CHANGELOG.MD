<a name="4.6.11"></a>
## [4.6.10](https://github.com/YvesCoding/vuescroll/compare/v4.6.9...v4.6.10) (2018-06-27)


### Features

* Add typescript support ([5dcec90](https://github.com/YvesCoding/vuescroll/commit/5dcec90))



<a name="4.6.10"></a>
## [4.6.10](https://github.com/YvesCoding/vuescroll/compare/v4.6.9...v4.6.10) (2018-06-26)

## Refator

* Tweak the class name of each components.

<a name="4.6.8"></a>
## [4.6.8](https://github.com/YvesCoding/vuescroll/compare/v4.6.5...v4.6.8) (2018-06-25)

## Features

 ### Slots

 * Add scroll-container, scroll-panel, scroll-content

## Refactor
 * Build scripts

## Breaking Changes
* You need to import vuescroll css file now!


<a name="4.6.5"></a>
## [4.6.5](https://github.com/YvesCoding/vuescroll/compare/v4.6.4...v4.6.5) (2018-06-11)


### Bug Fixes

* use currentTarget to replace target ([0611355](https://github.com/YvesCoding/vuescroll/commit/0611355))



<a name="4.6.4"></a>
## [4.6.4](https://github.com/YvesCoding/vuescroll/compare/v4.6.1...v4.6.4) (2018-06-06)


### Features

* **api:** add refresh/refreshAll ([ca7b5da](https://github.com/YvesCoding/vuescroll/commit/ca7b5da))



<a name="4.6.1"></a>

## [4.6.1](https://github.com/YvesCoding/vuescroll/compare/v4.5.33...v4.6.1) (2018-06-04)

### Features

* add border-radius to rail ([1d9f418](https://github.com/YvesCoding/vuescroll/commit/1d9f418))

<a name="4.6.0"></a>

# [4.6.0](https://github.com/YvesCoding/vuescroll/compare/v4.5.33...v4.6.0) (2018-06-04)

### Bug Fixes

* add z-index to rail ([6acc2b4](https://github.com/YvesCoding/vuescroll/commit/6acc2b4))

<a name="4.5.33"></a>

## [4.5.33](https://github.com/YvesCoding/compare/v4.5.32...v4.5.33) (2018-06-01)

### Bug Fixes

* don't call complete while \_\_isDecelerating is false ([ff0f950](https://github.com/YvesCoding/commit/ff0f950))

### Features

* add `direction info for event handle` ([42153e7](https://github.com/YvesCoding/commit/42153e7))

<a name="4.5.32"></a>

## [4.5.32](https://github.com/YvesCoding/compare/v4.5.31...v4.5.32) (2018-05-31)

### Bug Fixes

* update bar in setTimeout ([#31](https://github.com/YvesCoding/issues/31)) ([1b4b65d](https://github.com/YvesCoding/commit/1b4b65d))

### Features

* **api:** add triggerRefreshOrLoad Api that you can trigger refresh or load directly ([02fb682](https://github.com/YvesCoding/commit/02fb682))

<a name="4.5.31"></a>

## [4.5.31](https://github.com/YvesCoding/compare/v4.5.30...v4.5.31) (2018-05-30)

### Bug Fixes

* add min-width to scrollPanel, scrollContent([#32](https://github.com/YvesCoding/issues/32)) ([8fc54cd](https://github.com/YvesCoding/commit/8fc54cd))

<a name="4.5.30"></a>

## [4.5.30](https://github.com/YvesCoding/compare/v4.5.29...v4.5.30) (2018-05-29)

### Bug Fixes

* The content height while push-load is enable ([6f170ee](https://github.com/YvesCoding/commit/6f170ee))

<a name="4.5.29"></a>

## [4.5.29](https://github.com/YvesCoding/compare/v4.5.27...v4.5.29) (2018-05-29)

### Bug Fixes

* typo in createPanel.js ([40b45d7](https://github.com/YvesCoding/commit/40b45d7))

### Features

* Support customize [slot dom](http://vuescrolljs.yvescoding.org/guide/slot.html) in pull-refresh or push-load ([dc94053](https://github.com/YvesCoding/commit/dc94053))

<a name="4.5.27"></a>

## [4.5.27](https://github.com/YvesCoding/compare/v4.5.26...v4.5.27) (2018-05-27)

### Bug Fixes

* **silde-mode:** what scroll-panel's display style is inline-block may disrupt content style([d8e0eab](https://github.com/YvesCoding/commit/d8e0eab)), closes [#30]

### Features

* **bar:** Add showDuration to controll the show time of bars ([2f21464](https://github.com/YvesCoding/commit/2f21464))

<a name="4.5.24"></a>

## [4.5.24](https://github.com/YvesCoding/compare/v4.5.23...v4.5.24) (2018-05-25)

### Features

* **bar:** support dragging in mobile ([640bd7b](https://github.com/YvesCoding/commit/640bd7b))

<a name="4.5.22"></a>

## [4.5.22](https://github.com/YvesCoding/compare/v4.5.21...v4.5.22) (2018-05-24)

### Performance Improvements

* **bar:** refactor bar and rail ([706d274](https://github.com/YvesCoding/commit/706d274))

<a name="4.5.21"></a>

## [4.5.21](https://github.com/YvesCoding/compare/v4.5.20...v4.5.21) (2018-05-23)

### Bug Fixes

* update bar when mouse enters or moves ([7e0d76f](https://github.com/YvesCoding/commit/7e0d76f))

<a name="4.5.19"></a>

## [4.5.19](https://github.com/YvesCoding/compare/v4.5.18...v4.5.19) (2018-05-22)

### Bug Fixes

* incorrect bar position when there is a error of scrollHeight in browser ([5330cce](https://github.com/YvesCoding/commit/5330cce))

### Performance Improvements

* **scrollbar:** make the position of scrollbar more accurate ([50c1ca1](https://github.com/YvesCoding/commit/50c1ca1))

<a name="4.5.18"></a>

## [4.5.18](https://github.com/YvesCoding/compare/v4.5.17...v4.5.18) (2018-05-21)

### Bug Fixes

* get incorrect hash when component mounted ([6ad69af](https://github.com/YvesCoding/commit/6ad69af))

<a name="4.5.17"></a>

## [4.5.17](https://github.com/YvesCoding/compare/v4.5.16...v4.5.17) (2018-05-18)

### Bug Fixes

* rename comonent to component ([d9995b8](https://github.com/YvesCoding/commit/d9995b8))
* typo ([c19f27d](https://github.com/YvesCoding/commit/c19f27d))

### Features

* **api:** Add scrollIntoView api that allows you scroll an elment into view ([50a458b](https://github.com/YvesCoding/commit/50a458b))

<a name="4.5.13"></a>

## 4.5.13 (2018-05-09)

### Bug Fixes

* indent ([0c31be8](https://github.com/YvesCoding/commit/0c31be8))
* internalscrollTop should default to 0 ([418b45a](https://github.com/YvesCoding/commit/418b45a))
* rail's borderradius cannot be dynamiclly set ([de6c4c2](https://github.com/YvesCoding/commit/de6c4c2))
* typo in readme ([057dfda](https://github.com/YvesCoding/commit/057dfda))
* typo in readme ([6955321](https://github.com/YvesCoding/commit/6955321))

### Features

* **api:** add preventDefault option ([70e1886](https://github.com/YvesCoding/commit/70e1886))

### Performance Improvements

* **touch:** optimize scroll experience ([53148ed](https://github.com/YvesCoding/commit/53148ed))

<a name="4.5.12"></a>

## 4.5.12 (2018-05-04)

### Bug Fixes

* error process when mode is 'slide' ([3eaa1ca](https://github.com/YvesCoding/commit/3eaa1ca))
* typo ([ff76b39](https://github.com/YvesCoding/commit/ff76b39))

### Features

* **api:** add zoomTo, zoomBy, getCurrentviewDom methods ([7769099](https://github.com/YvesCoding/commit/7769099))
* **paging:** add getCurrentPage, goToPage api for paging in slide mode ([a3e2478](https://github.com/YvesCoding/commit/a3e2478))

<a name="4.5.9"></a>

## 4.5.9 (2018-04-30)

### Features

* add zooming options to enable zoom in slide mode or not ([ed0e4f3](https://github.com/YvesCoding/commit/ed0e4f3))

<a name="4.5.5"></a>

## 4.5.5 (2018-04-28)

### Performance Improvements

* set document select none when mouse is clicked ([5e24562](https://github.com/YvesCoding/commit/5e24562))

<a name="4.5.4"></a>

## 4.5.4 (2018-04-27)

### Bug Fixes

* resize event didn't trigger in FireFox ([dbb5908](https://github.com/YvesCoding/commit/dbb5908)), closes [#22](https://github.com/YvesCoding/issues/22)
* typo ([d89ec35](https://github.com/YvesCoding/commit/d89ec35))
* typo ([11da6a8](https://github.com/YvesCoding/commit/11da6a8))

<a name="4.5.0"></a>

# 4.5.0 (2018-04-26)

### Bug Fixes

* use internalscrollLeft in scrollTo api ([003be27](https://github.com/YvesCoding/commit/003be27))

### Features

* add scrollby api ([8161055](https://github.com/YvesCoding/commit/8161055))
* **core:** add pure-native mode that you can use native scrollbar in vuescroll ([8249b5d](https://github.com/YvesCoding/commit/8249b5d))

<a name="4.1.2"></a>

## 4.1.2 (2018-04-17)

### Bug Fixes

* record pos confilt ([6250c2b](https://github.com/YvesCoding/commit/6250c2b))

<a name="4.1.1"></a>

## 4.1.1 (2018-04-17)

### Bug Fixes

* a typo error in readme ([5f81713](https://github.com/YvesCoding/commit/5f81713))
* add a limit to scroll distance ([4c2220b](https://github.com/YvesCoding/commit/4c2220b))
* calculate scrollPanel's height wrongly while width isn't overflow ([81d7159](https://github.com/YvesCoding/commit/81d7159))
* called function wrongly (fix:[#4](https://github.com/YvesCoding/issues/4)) ([cf89320](https://github.com/YvesCoding/commit/cf89320))
* change condition to hBar instead of vBar ([1c88f26](https://github.com/YvesCoding/commit/1c88f26))
* dynamic set gutter, use es6 syntax to write code ([225c458](https://github.com/YvesCoding/commit/225c458))
* error calculate content's height ([c83a9b5](https://github.com/YvesCoding/commit/c83a9b5))
* error class name of hiding the bar ([ac938f5](https://github.com/YvesCoding/commit/ac938f5))
* error correct scrollPanel height ([2f9d70e](https://github.com/YvesCoding/commit/2f9d70e))
* error transform style ([ccd620c](https://github.com/YvesCoding/commit/ccd620c))
* hide default scrollbar ([83a3c48](https://github.com/YvesCoding/commit/83a3c48))
* judge if vue.\_isDestroyed to nextTick ([b1f56a6](https://github.com/YvesCoding/commit/b1f56a6))
* lot of bugs ([c6cb5fd](https://github.com/YvesCoding/commit/c6cb5fd))
* options: scrollContent padding not work(fix:[#6](https://github.com/YvesCoding/issues/6)) ([b3d2c87](https://github.com/YvesCoding/commit/b3d2c87))
* resize window scroll doesn't update ([9184bba](https://github.com/YvesCoding/commit/9184bba))
* some bugs ([e60f6eb](https://github.com/YvesCoding/commit/e60f6eb))
* typo ([3c5402f](https://github.com/YvesCoding/commit/3c5402f))
* typo ([f1958d4](https://github.com/YvesCoding/commit/f1958d4))
* typo of setting style of scrollPanel ([1cb3ecb](https://github.com/YvesCoding/commit/1cb3ecb))

### Features

* add mode options ([72443a6](https://github.com/YvesCoding/commit/72443a6))
* add native option ([699b068](https://github.com/YvesCoding/commit/699b068))
* add pull refresh ([4191c9a](https://github.com/YvesCoding/commit/4191c9a))
* add zoom support to non-native mode ([d439e4c](https://github.com/YvesCoding/commit/d439e4c))
* merge code ([d0bfd38](https://github.com/YvesCoding/commit/d0bfd38))
* rewrite scrollContent and scrollRail to functional components ([63f243d](https://github.com/YvesCoding/commit/63f243d))
* sweak core code ([6f12e8d](https://github.com/YvesCoding/commit/6f12e8d))
* sweak the core architecture ([9fe86f9](https://github.com/YvesCoding/commit/9fe86f9))
* sync some feature between vuescroll and scroller ([5bae654](https://github.com/YvesCoding/commit/5bae654))
* update ([a11cc79](https://github.com/YvesCoding/commit/a11cc79))
* use jsx ([90f3139](https://github.com/YvesCoding/commit/90f3139))
