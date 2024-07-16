# Ordering System

### This is a basic implementation of a restaurant ordering system.

### Bugs:

- [x] 在orderingpage页面上充值，显示余额不会刷新，需要手动重启

- [x] Admin订单未统计总金额

- [x] OrderingPage美化

- [x] OrderSummary美化

- [x] FinishPage美化

- [ ] 登陆界面按Enter键没有反应（zfy正在做）

- [x] 登陆界面弹出成功/失败消息时窗口宽度会变化

- [ ] AdminRatingPage: 第一次进入时不会显示总评分，要刷新一下才可以

- [ ] AdminOrderPage: 对于rejected的订单可以一直点退款

- [ ] OrderingPage: 点击继续点菜后，显示的余额和第一次点菜时没有变化；如果两次点菜有重复，提交时console会报神秘的错

#### TO-DO:

1. 表单类：

- [x] customer.user_name新增两列：电话、昵称phone, nickname

- [x] customer.order_rec新增两列：完成状态finish_state、外卖/堂食属性takeout

- [x] chef.user_name新增一列：厨师工号uid

- [x] chef_log新增表单，五列：dish_name, customer, chef, dish_count, state

- [x] customer.ratings新增表单，七列：customer_name, comment, overall, taste, pack, serv, env

- [x] admin.dishes新增表单，三列：name, img_path, price

- [x] customer.user_name新增一列：余额savings

2. 页面类：

- [x] 顾客注册页面新增：昵称，电话号码；

- [x] 点单页面新增：外卖、堂食选项，外卖需要填写地址

- [x] (Not going to do)如果检测到有点单，添加按钮：跳转到点单完成页面；

- [x] 厨师登陆页面新增：检测特殊用户名，跳转至管理员页面；

- [x] 顾客点单完成页面：可以查看自己的点单信息，完成后可以给出评价；

- [x] 管理员页面：可以查看点餐量、厨师评价、菜品评价，修改菜品等

- [x] 顾客个人档案页面：查看并修改个人信息

- [x] 顾客钱包页面：查看余额并充值

- [x] 顾客历史订单页面：查看此前的订单及是否完成

- [x] 点单页面新增：给每种菜品添加价格

3. 方法类：

- [x] 顾客注册方法修改，支持昵称和电话号码；

- [x] 厨师登录方法修改，支持特殊用户检测；

- [x] 顾客查询方法新增，查询余额、历史订单等信息

- [x] 管理员查询方法新增，支持查看点餐量、厨师评价、菜品评价

- [x] 管理员修改方法，支持修改、添加菜品（选择性实现）
