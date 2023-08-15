
# 2023 法律X法遵科技黑客松

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


### 啟動專案方法
```
npm install # 需要先安裝 package.json 的套件，如果有了可以跳過
npm start
```

#### 錯誤排查

> 如果 npm start 啟動出現下列錯誤   
> ```
> One of your dependencies, babel-preset-react-app, is importing the "@babel/plugin-proposal-private-property-in-object" package without declaring it in its dependencies. 
> This is currently working because "@babel/plugin-proposal-private-property-in-object" is already in your node_modules folder for unrelated reasons, but it may break at any time. babel-preset-react-app is part of the create-react-app project, which is not maintianed anymore. It is thus unlikely that this bug will ever be fixed. Add "@babel/plugin-proposal-private-property-in-object" to your devDependencies to work around this error. This will make this message go away.
>  ```   
> 可打下列指令: [參考資料](https://stackoverflow.com/questions/76435306/babel-preset-react-app-is-importing-the-babel-plugin-proposal-private-propert)
> ```
> npm install --save-dev @babel/plugin-proposal-private-property-in-object --legacy-peer-deps
> ```

> 如果 npm start 啟動出現下列錯誤 
> ```
> [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. 
> Please use the 'setupMiddlewares' option. 
> (Use `node --trace-deprecation ...` to show where the warning was created)
> ```
> [參考解決](https://www.youtube.com/watch?v=ifSTp9WEHpo)

### 套件

+ [Ant Design](https://ant.design/)
+ React Dom 
  參考[React Router 巢狀路由](https://israynotarray.com/react/20221009/2778078774/)



--------------------------------

# 畫面構思

需要功能：
1. 準備民事車禍案例  ==> [LJP (Legal Judgement Prediction)](https://docs.google.com/presentation/u/0/d/1hsUt62QNnXDliu4CtxB-HAqfzGjMtn2G5aoHi6lnvjc/edit)  &rArr; 相似案例 (經過事實、傷勢)
2. 創建一個車禍法律諮詢服務機器人  &rArr; 生成經過事實
	1. 將問題分群
3. 創建一個發生事故的行為人代理人(以判決書為藍本)

## Home

在 Chat 中將資料建立後，確認成立與機器人他程協議後的文本將建立在 Home，可隨時進行查閱及編輯，有考慮輸出PDF 等等。

## Chat

與機器人探討事件過程與生成事實經過，將問題進行分群及預測賠償金額等，確認後將儲存至 Home。

## Agent

從 Home 中擷取以確認案例，利用事故機器行為代理人，以判決書為藍本與使用者輸出事件經過。






---

<!-- # Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify) -->
