#!/bin/bash

yarn build
cp -r dist sys
tar -zcf sys.tar.gz sys/
scp sys.tar.gz my-tencent-machine:/lab/web/
ssh my-tencent-machine "rm -rf /lab/web/sys/; tar -zxf /lab/web/sys.tar.gz -C /lab/web/;"
rm -rf sys/
rm -f sys.tar.gz

#cp -r dist ip
#tar -zcf ip.tar.gz ip/
#scp ip.tar.gz root@47.111.227.51:/lab/web/
#ssh root@47.111.227.51 "rm -rf /lab/web/ip/; tar -zxf /lab/web/ip.tar.gz -C /lab/web/;"
#rm -rf ip/
#rm -f ip.tar.gz
