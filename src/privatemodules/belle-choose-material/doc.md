# belle-choose-material 组件使用文档

## 属性
| 名称 | 描述 | 类型 | 默认值 |
| :------ | :------ | :------ | :------ |
| language | 语言 | `string` | `-` |
| list | 列表数据 | `array` | - |

## 事件
| 参数 | 说明 | 类型 | 默认值 |
| :------ | :------ | :------ | :------ |
| onChoose | 选中素材后的回调 | `function(data)` | - |
| onSearch | 点击搜索按钮后的回调 | `function(searchType, searchKeyword)` | - |

## 方法
| 名称 | 描述 |
| :------ | :------ |
| showDialog() | 显示弹出框 |
| closeDialog() | 关闭弹出框 |

## 数据结构说明
| 名称 | 描述 |
| :------ | :------ |
| id | 编号 |
| title | 标题 |
| href | 文章的链接 |
| cover | 头部大图文章，有图片 |
| image | 大图文章的图片 |
| list | 无图片的文章列表 |
| updateTime | 更新时间 |
```
{
    "id": "ST234",
    "title": "",
    "cover": {
    "title": "教你轻松科学地解决“鞋子掉根”，教你轻松科学地解决“鞋子掉根”！",
    "image": "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
    "href": "http://111"
    },
    "list": [
    {
        "title": "Belle试鞋间丨5分钟就能出门的职场穿搭秘籍",
        "href": "http://222"
    },
    {
        "title": "19年市场趋势大公开，大家都在穿什么鞋？",
        "href": "http://333"
    }
    ],
    "updateTime": "2019-05-19"
}
```