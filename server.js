var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log("有个傻子发请求过来啦！路径（带查询参数）为：" + pathWithQuery);

  response.statusCode = 200;
  // 默认首页
  const filePath = path === "/" ? "/index.html" : path; //如果path是/的话，我们就默认它访问/index.html，否则就是正确对应的路径
  const index = filePath.lastIndexOf(".");
  // suffix 是后缀
  const suffix = filePath.substring(index); //从.下标开始获取路径的子字符串
  const fileTypes = {
    //数据结构
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  };
  response.setHeader(
    "Content-Type",
    `${fileTypes[suffix] || "text/html"};charset=utf-8` //因为又可能不是我们写好中的任何一个，所以需要一个兜底的选择为'text/html'
  );
  let content; //声明一个content 让content去读取我们写的路径对应的文件，但是如果是不存在的文件就会报错，所以我们需要一个try catch的操作
  try {
    content = fs.readFileSync(`./public${filePath}`); //try内的代码有可能会报错
  } catch (error) {
    content = "文件不存在"; //一旦报错，那么我们就抓住这个错误，让他的内容就是文件不存在
    response.statusCode = 404;
  }
  response.write(content);
  response.end();

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
