# Node

Node 类是所有可视对象或组件的基类。

## 属性

|属性名|类型|说明|
|-|-|-|
| _instanceType | string | 节点类型 |
| align | string，Function | 相对于父容器的对齐方式|
| opacity | number | 节点的透明度，0~1，默认值为1，不透明 |
| background | Object | 节点的背景样式。可以是 css 颜色值、canvas 的 gradient 或 pattern 填充 |
| bounds | Bounds | 可视区域的顶点坐标包围盒 |
| zIndex | number | 节点深度，只读属性 |
| height | number | 节点高度，默认值为0 |
| width | number | 节点宽度，默认值为0 |
| mask | Graphics | 节点的遮罩图形 |
| parent | Node | 节点的父容器，只读属性 |
| anchorX | number | 节点锚点的x轴坐标，默认为0 |
| anchorY | number | 节点锚点的y轴坐标，默认为0 |
| mouseEnabled | boolean | 节点是否接受鼠标或触控事件，默认接受为true |
| rotation | number | 节点的旋转角度，默认为0 |
| scaleX | number | 节点在x轴上的缩放比例，默认不缩放，为1 |
| scaleY | number | 节点在y轴上的缩放比例，默认不缩放，为1 |
| transform | Matrix2d | 节点的transform属性，如果设置将忽略x，y，scaleX，scaleY，rotation属性 |
| visible | boolean | 节点是否可见，默认可见为 true |
| x | number | 节点的x轴坐标，默认为0 |
| y | number | 节点的y轴坐标，默认为0 |

## 方法

|方法名|参数|返回值|说明|
|-|-|-|-|
| addTo | parent: Node  index:number | View | 添加此节点到父节点 |




