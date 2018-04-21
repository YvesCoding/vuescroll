## Change Log
---
### v4.3.3
#### Features
* To disable scrollbar or rail, add `disabled` option to `vRail, vBar, hRail, hBar`
#### Tweaks
* Now, when snapping or paging enable, the bar/rail will show. 
---
### v4.3.3
#### Features
* Add `paging` and `snapping` options to the `vuescroll` option.
##### Usage
```javascript
    ops: {
        vuescroll: {
            paging: true, // set scrollPanel's option scrollingX or Y to enable pagingX and pagingY
            snapping: {
                enable: false, // or true
                width: 100, // snap width
                height: 100 // snap height
            }
        }
    }

```  
---
### v4.2.3
#### Bug Fix
 * Can not drag scrollBar in IE/edge #14
 * Remove gutter when disabel scrollingX or scrollingY #15
---
### v4.2.2
 #### Features
 * Allow to change global options **root** property #8
---
### V4.1
#### Features
 * Push-Load has been supported
 ##### Usage:
 ```javascript
    ops: {
      vuescroll: {
          pushLoad: {
              enable: true
          }
      }  
    }
 ```
 * Allow to diable scrollingX or scrollingY #11

 ##### Usage:
  ```javascript
    ops: {
      scrollPanel: {
        scrollingX: true,// false to disable
        scrollingY: true // false to disable
      }  
    }
 ```

#### Sweaks
* Redefine pull-refresh tips from `Array` to `Object`
##### Before
```javascript
  ops: {
      vuescroll: {
          pushRefreshTips: ['XX', 'XX']
      }
  }
```
###### Now
```javascript
  ops: {
      vuescroll: {
          pushRefresh: {
              tips: {
                  start: "",
                  active: "",
                  deActive: "",
                  beforeActive: ""
              }
          }
      }
  }
```
---
### V4.0
#### Features
  * Add a **vuescroll** option in ops. Now, you can choose two modes for vuescroll. **slide**mode or **native** mode.
  ```javascript
   ops: {
    vuescroll: [
     mode: 'native' // native or slide
    }
    // other options...
  }
 ```
 * Pull-refresh supported (Only for slide mode)
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-pull-refresh.gif?raw=true)

#### Bug Fix
   * Can't hide native scrollbar in FireFox.#10 