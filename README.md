# Ordering System

### This is a basic implementation of a restaurant ordering system.

#### TO-DO:

1. 表单类：

- [ ] customer.user_name新增两列：电话、昵称phone, nickname

- [ ] customer.order_rec新增一列：外卖/堂食属性takeout

- [ ] chef.user_name新增一列：厨师工号uid

- [ ] chef.finished新增表单，四列：dish_name, customer, chef, dish_count

- [ ] customer.ratings新增表单，四列：dish_name, customer, chef, rating

2. 页面类：

- [ ] 顾客注册页面新增：昵称，电话号码；

- [ ] 厨师登陆页面新增：检测特殊用户名，跳转至管理员页面；

- [ ] 点单页面新增：外卖、堂食选项，外卖需要填写地址；如果检测到有点单，直接跳转到点单完成页面；

- [ ] 顾客点单完成页面：可以查看自己的点单信息，完成后可以给出评价；

- [ ] 管理员页面：可以查看点餐量、厨师评价、菜品评价，修改菜品等

3. 方法类：

- [ ] 顾客注册方法修改，支持昵称和电话号码；

- [ ] 厨师登录方法修改，支持特殊用户检测；

- [ ] 管理员查询方法新增，支持查看点餐量、厨师评价、菜品评价

- [ ] 管理员修改方法，支持修改菜品（选择性实现）
