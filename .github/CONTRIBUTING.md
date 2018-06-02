# English Version

Contributing code from two aspects：

### Code level

Vuescroll is extremely easy to expand.You only have to do 2 steps

1.  To modify / add the corresponding features at the corresponding modules in the [global-config.js](https://github.com/YvesCoding/blob/dev/src/shared/global-config.js) file, for example, I want to add a feature that can configure the color of the scrolling panel, the default is red, as follows:
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s1.jpg?raw=true)
2.  Find the corresponding module file and modify it in the corresponding code of the module, as follows:
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s2.jpg?raw=true)
    <br>
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s3.jpg?raw=true)

### Git level

1.  Fork this repo.
2.  Clone the repo you have just forked.

```base
   git clone git@github.com:<Your Username>/vuescroll.git
```

3.  Modify the code in your local and push the code to your remote repo(Commit messages should follow the [commit message convention](./COMMIT_CONVENTION.md) so that changelogs can be automatically generated).
4.  Click `New pull request` in vuescroll repo as follows:
    <br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" />
5.  When I agree, your code will merge into the `dev` branch!

# 中文版本

从两方面贡献代码:

### 代码层面

Vuescroll 是极其容易扩展的，你基本只需要做 2 步即可。

1.  在 [global-config.js](https://github.com/YvesCoding/blob/dev/src/shared/global-config.js) 文件中对应的模块处修改/增加对应的特性，比如，我想增加一个可以配置滚动面板颜色的特性,默认是红色，如下图：
    <br>
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s1.jpg?raw=true)
2.  找到对应的模块文件， 并在模块的对应的代码处修改即可，如下图：
    <br>
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s2.jpg?raw=true)
    <br>
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s3.jpg?raw=true)

### Git 层面

1.  把这个项目 fork 下来。
2.  把你的 fork 的项目克隆下来

```base
   git clone git@github.com:<Your Usernmae>/vuescroll.git
```

3.  在你的本地修改代码然后 push 到你的远程仓库(提交消息应该遵循[[commit message convention](./COMMIT_CONVENTION.md) 以便能自动生成changelog)
4.  在 vuescroll 项目地址点击`New pull request`，如下图所示:<br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" />
5.  等我点击同意， 你的代码就会被 merge 到`dev`分支了！
