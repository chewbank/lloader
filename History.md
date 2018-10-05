## 更新记录

### 1.0.3

* ...load.js文件更名为...loader.js

* 修改默认配置的加载等级为100

### 1.0.4

* 不再隐式屏蔽模块内部抛出的错误


### 1.0.5

* 阻止覆盖已存在的同名对象

### 1.0.6

* 新增before、after钩子

* 将import更名为module，complete更名为directory

### 1.0.7

* 修改before、after钩子参数为data ,container

### 1.0.8

* 忽略除.js和.json后缀以外的所有文件类型

### 1.1.0

* 采用新的同级分组对象递归结构替换原来的列表结构

* 修改before、after生命周期

### 1.1.1

* 修复通过getter方式定义的属性在被同名属性覆盖时会报错的bug