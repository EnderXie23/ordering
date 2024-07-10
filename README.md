# Ordering System

### This is a basic implementation of a restaurant ordering system.

#### TO-DO:

1. 表单类：

- [x] customer.user_name新增两列：电话、昵称phone, nickname

- [x] customer.order_rec新增两列：完成状态finish_state、外卖/堂食属性takeout

- [x] chef.user_name新增一列：厨师工号uid

- [x] chef_log新增表单，五列：dish_name, customer, chef, dish_count, state

- [ ] customer.ratings新增表单，四列：dish_name, customer, chef, rating

- [ ] admin.dish新增表单，三列：name, path, price

- [ ] customer.user_name新增一列：余额saving

2. 页面类：

- [x] 顾客注册页面新增：昵称，电话号码；

- [ ] 点单页面新增：外卖、堂食选项，外卖需要填写地址；如果检测到有点单，添加按钮：跳转到点单完成页面； （zfy正在做）

- [x] 厨师登陆页面新增：检测特殊用户名，跳转至管理员页面；

- [x] 顾客点单完成页面：可以查看自己的点单信息，完成后可以给出评价；

- [x] 管理员页面：可以查看点餐量、厨师评价、菜品评价，修改菜品等

- [ ] 顾客个人档案页面：查看并修改个人信息 （gq正在做）

- [ ] 顾客钱包页面：查看余额并充值

- [ ] 顾客历史订单页面：查看此前的订单及是否完成

- [ ] 点单页面新增：给每种菜品添加价格

3. 方法类：

- [x] 顾客注册方法修改，支持昵称和电话号码；

- [x] 厨师登录方法修改，支持特殊用户检测；

- [ ] 管理员查询方法新增，支持查看点餐量、厨师评价、菜品评价

- [ ] 管理员修改方法，支持修改、添加菜品（选择性实现）
