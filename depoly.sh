#!/bin/bash

echo "build 生成生产环境代码"

rm -rf dist && npm run build

echo "上传代码到云主机"

#链接远程服务器拷贝代码文件
cd dist && scp -i ~/.ssh/vikingship.pem -r * root@121.199.70.72:/var/www/zhihu
