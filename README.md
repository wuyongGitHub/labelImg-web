# canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具
图片标注网站，用fabric.js基于 canvas对图片进行标注，需要进行数据集的标注，多边形标注，矩形标注，复制粘贴，上一张下一张，主要技术栈vue3+fabric.js实现网页版本LabelImg标注功能。
# canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】
# 目录
- 前言
- 主体功能
- 效果预览
- 实现步骤
- 第一步、布局实现
- 第二步、下载并引入fabric.js对象及功能方法
- 第三步、初始化画布
- 第四步、标注图片初始化
- 第五步、设置画布及其他事件监听器
- 第六步、 矩形标注实现
- 第七步、多边形标注实现
- 第八步、坐标转换系统
- 第九步、标签管理
- 第十步、十字辅助线创建
- 第十一步、自定义控制点
- 第十二步、基于标签文本生成固定颜色
- 第十三步、进行矩形的回显绘制
- 第十四步、矩形及多边形绘制结束label弹窗
- 第十五步、根据数据源回显多边形
- 第十六步、导出数据格式及其数据
- 完结~
- 优化进行中~ 关注我不定时进行代码优化与功能添加
- 优化一、添加标注的复制粘贴功能
- 优化二、添加不规则多边形规则处理
- 优化三、多边形创建交互优化【防呆处理】
- 优化四、添加标注结果导出图片功能
- 优化五、创建多边形方式优化
- 优化六、创建标注框的标签方式优化
- 优化七、解决超大图放大后绘制卡顿问题
- 优化八、四角控制点随意拖拽放大长和宽【摒弃等比放大缩小】
- END
## 前言
经过[Fabric.js从入门学习到实现labelImg矩形多边形标注工具【上】](https://blog.csdn.net/qq_42696432/article/details/149866418?fromshare=blogdetail&sharetype=blogdetail&sharerId=149866418&sharerefer=PC&sharesource=qq_42696432&sharefrom=from_link) 的学习，开始进入前端标注工具的实战阶段，该工具可以进行源码二次开发或者根据自己的标注需求进行拓展，结尾有获取源码的方式~

## 主体功能
当前工具实现了`labelImg的`标注功能，其中有：
> 1. 辅助线功能，方便查看标注过程中的参照位置。【可开关控制】
> 2. 鼠标指向点滚轮缩放或点击缩放按钮进行缩放功能。
> 3. 进行大图片自适应窗口及自适应缩放按钮功能。
> 4. 进行上一张，下一张图片标注切换功能。
> 5. 可通过`”w“`键进行矩形框的拖拽创建绘制。
> 6. 可通过按钮进行多边形框的多点绘制功能。
> 7. 可进行矩形框的拖拽修改大小以及双击修改`label`标签内容。
> 8. 多边形双击进入编辑，再双击进入预览状态，可对顶点进行拖拽编辑功能。
> 9. 可根据定义好的矩形数据以及多边形数据进行矩形多边形的回显功能。
> 10. 可进行数据的精确的导出，矩形【导出上下左右点位及中心点】，多边形【导出各个点的位置】
> 11. 可同时标注多边形矩形且可以层叠绘制，鼠标移入高亮等可视化功能。
> 12. 固定字符固定随机颜色。
> 13. 可对矩形多边形进行复制粘贴操作。【优化一】
> 14. 不规则交叉多边形规则化配置开关。【优化二】
> 15. 多边形创建不适用临时点线，而是临时矩形点线且最后一个点动态临时矩形【优化三】
> 16. 添加标注结果导出图片功能【优化四】
> 17. 创建多边形临时点线改为临时多边形，且临时多边形最后一个点跟着鼠标变换。【优化五】
> 18. 创建多边形和矩形label标签改为下拉框选择【优化六】
> 19. 解决高清大图放大后绘制矩形和多边形出现卡顿问题【优化七】
> 20. 仿照labelImg矩形标注，重写四个角控制矩形，摒弃等比放大，可进行拖拽改变高宽值【优化八】

![Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/074acde8cd9f44cea9815d501bbd6d62.png)

## 效果预览
矩形标注：
![Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/b5730ad787ae44d8953da734f4548691.png)
多边形标注：
![Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/5f6f3de94f28480795a95287860a59b5.png)
十字辅助线
![Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/79287769ef2946bf8783db8d304c704a.png)

导出数据格式：
![Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/6921c8b630b54e78a550f1c4fbf67f99.png)
标签修改：
![Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/7d0c6359ec0e4fff9088e77d4daf11df.png)

多边形回显
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/fe68d03c31ea4a39a8ab6632a13920a7.gif)
复制粘贴功能
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/a1e5cd4531eb46bfaced0665d833eb47.gif)
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/2c8fe1f3173a4ce08a798ca0a0ff6871.png)

多边形规则化添加：
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/d69280ec10154d03aafb935a7280f06b.gif)
多边形创建优化：
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/c372a2ef92af42ec97e9a8d30a707dee.gif)

导出标注功能
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/a95c7454256f45fd9b7c60709dbb8bc4.gif)

[video(video-b6tnAS6E-1754957509822)(type-bilibili)(url-https://player.bilibili.com/player.html?aid=115009459849246)(image-https://i-blog.csdnimg.cn/img_convert/b70739ac58df67253c673ff916e02772.jpeg)(title-canvas标注)]




[video(video-QB7oHwHP-1754151835748)(type-bilibili)(url-https://player.bilibili.com/player.html?aid=114901800452347)(image-https://i-blog.csdnimg.cn/img_convert/d55912a59d0675fda9b463c99e2f53ff.jpeg)(title-矩形标注)]


[video(video-GZss0Dmm-1754451273780)(type-bilibili)(url-https://player.bilibili.com/player.html?aid=114960101280724)(image-https://i-blog.csdnimg.cn/img_convert/5df5346a18a502b14e9c7976dedfb980.jpeg)(title-多边形标注工具web端)]

## 实现步骤

### 第一步、布局实现

> - 左侧工具栏：包含各种工具按钮，如辅助线、保存、图片切换按钮等。
> - 中间图像区域：显示需要标注的图像，并且有绿色线条辅助标注。
> - 右侧标签列表：显示文件列表和标签信息

![Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/5bd8818bb99f46ef87f7fc572518bbee.png)
我比较直接，使用了绝对定位实现的圣杯布局：
- `.left-menu` 类设置了左边栏，其宽度固定为`122px`。
- `.right-list` 类设置了右边栏，其宽度固定为`230px`。
- `.canvas-box` 类代表中央内容区，它的左右位置分别由左边栏和右边栏的宽度决定，并且通过设置 `left:122px; right: 230px;` 来确保中央内容区不会与两边栏重叠。

```css
.right-list {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 230px;
    background: #f0f0f0;
 }
 .left-menu {
    position: absolute;
    left: 0;
    height: 100%;
    width: 122px;
    padding-top: 5px;
    background: #f0f0f0;
    position: relative; /* 确保伪元素相对于这个元素定位 */
  }
  .canvas-box {
    position: absolute;
    left: 122px;
    right: 230px;
    top: 0;
    bottom: 0;
    overflow: hidden;
 }
```
使用绝对定位来安排页面元素的方式是实现圣杯布局的一种方法。也可以不使用我的这种布局，自行使用【`flex`布局，`grid`布局，`float`浮动布局】等很多方法都可实现。
### 第二步、下载并引入fabric.js对象及功能方法
下载：
```javascript
npm install fabric
或者
yarn add fabric
```

引入：
```javascript
import {
  Canvas, // 这是 Fabric.js 的核心类，代表整个画布（Canvas）实例。
  Line,  // 用于创建直线对象
  Group,  // 将多个 Fabric 对象组合成一个组（Group），可以统一进行移动、缩放、旋转等操作。
  FabricImage,  // 用于加载和操作图片对象。
  controlsUtils, // 提供与控件相关的实用工具函数，用于自定义对象的控制点（如缩放、旋转手柄）。
  Rect, // 创建矩形对象。
  Point, // 表示一个二维坐标点（x, y）。
  Textbox, // 可编辑的多行文本框对象。
  Control, // 定义画布对象上的控制点（小方块手柄），比如缩放、旋转、移动等
  util, // Fabric.js 提供的通用工具函数集合。
  Circle, // 创建圆形对象。
  Text, // 创建静态文本对象（不可编辑）。
  Polygon, // 创建多边形对象。
} from "fabric";
```

### 第三步、初始化画布
使用`Fabric.js`创建画布，并加载当前图片。注意设置画布尺寸为父容器大小，并处理图片的缩放和居中。

```javascript
// 初始化 Fabric 画布
function initFabricCanvas() {
  // 确认canvas元素是否存在，不存在return
  if (!canvas.value) return;
  // 获取画布的父容器元素
  const container = canvas.value.parentElement;
  // 确认父容器元素存在，不存在return
  if (!container) return;
  // 创建新的Fabric布实例，并设宽高背景颜色属性
  fCanvas = new Canvas(canvas.value, {
    width: container.clientWidth, // 设置Fabric的宽度为容器的宽度
    height: container.clientHeight, // 设置Fabric的高度为容器的高度
    // backgroundColor: "#ffff00", // 设置背景颜色为黄色
    selection: true, // 关闭选择功能
    preserveObjectStacking: true, // 允许对象堆栈改变
    altSelectionKey: "altKey",
  });
}
```
### 第四步、标注图片初始化
1. 检查 `Fabric` 画布是否初始化：在开始任何操作之前，首先检查 `fCanvas` 是否已经初始化。如果没有，则输出警告并退出函数，防止后续操作出错。
2. 加载图片：通过调用 `FabricImage.fromURL` 方法（这里假设是 `Fabric.js` 提供的用于加载图片的方法），从指定的 `URL` 加载图片。加载时设置了跨域资源共享`(CORS)`为匿名模式，以便处理跨域图片资源的问题。
3. 计算缩放比例和调整图片尺寸：根据父容器的高度来计算图片需要缩放的比例，使得图片能适应容器的高度。同时保存这个缩放比例，可能用于后续的操作。
4. 配置并添加图片到画布：将加载的图片应用上述计算好的缩放比例，并设置其在画布中的位置为居中。然后更新画布尺寸使其匹配容器尺寸，并将图片对象添加到画布中显示出来。
5. 绘制已有标签数据：如果有针对当前图片的标签数据（如标注信息），则调用 `drawLabels` 函数进行绘制，这通常用于图像标注工具中。
6. 实现交互式十字辅助线：为了增强用户体验，函数还创建了一个额外的透明 `Canvas` 层，用于在用户鼠标移动时动态绘制十字辅助线，从而提供精确的位置指示。
7. 事件监听与处理：通过监听容器的鼠标移动和离开事件，实现在用户与画布交互时实时更新十字辅助线的位置，或者在鼠标离开时清除这些辅助线。
```javascript
// 异步加载图片
async function loadImage(url: string) {
  // 如果fabric未初始化，则输出警告并返回
  if (!fCanvas) {
    console.warn("fCanvas 未初始化");
    return;
  }
  // "http://192.168.80.32:8888/Image_20250306140749112.png"
  try {
    // 使用Fabric加载图片，并设置跨域资源共享(CORS)为匿名
    const imgObj = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    console.log("图片加载完成", imgObj);
    // 获取画布容器的Dom元素，并计算缩放比例
    const container = fCanvas.getElement().parentElement as HTMLElement;
    const scale = container.clientHeight / imgObj.height!;

    imgScale = container.clientHeight / imgObj.height!;
    // imgObj.scale(imgScale);
    // 应用缩放比例，并设置图片在画布中的位置
    imgObj.scale(scale);
    // 设置图片的居中位置
    imgObj.set({
      originX: "center",
      originY: "center",
      left: fCanvas.getWidth() / 2,
      top: fCanvas.getHeight() / 2,
      selectable: false,
      evented: false,
    });
    // 更新画布尺寸，并添加图片对象到画布中
    fCanvas.setDimensions({
      width: container.clientWidth,
      height: container.clientHeight,
    });
    // 刷新画布以显示图片
    fCanvas.add(imgObj);
    // 重置视口变换，并请求重新渲染整个画布
    fCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    fCanvas.requestRenderAll();
    drawLabels(imageLabelData[currentIndex.value].labelInfo, imgObj);

    // 创建或获取顶层canvas
    const crossCanvas = createCrossCanvas(container);
    crossCanvasDom.value = createCrossCanvas(container);
    const ctx = crossCanvas.getContext("2d")!;
    // 绑定鼠标移动事件绘制十字线（注意要先解绑避免重复绑定）
    container.removeEventListener("mousemove", onMouseMove);
    container.addEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseleave", onMouseLeave);
    container.addEventListener("mouseleave", onMouseLeave);

    function onMouseMove(e: MouseEvent) {
      const rect = crossCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!isShowCrosshairImpont.value) return; // 显示优先级大于isCrosshair
      if (!isCrosshair.value) return;
      ctx.clearRect(0, 0, crossCanvas.width, crossCanvas.height);
      ctx.beginPath();
      ctx.strokeStyle = "#00ff01";
      ctx.lineWidth = 0.8;
      // 横线
      ctx.moveTo(0, y);
      ctx.lineTo(crossCanvas.width, y);
      // 纵线
      ctx.moveTo(x, 0);
      ctx.lineTo(x, crossCanvas.height);
      ctx.stroke();
    }
    function onMouseLeave() {
      ctx.clearRect(0, 0, crossCanvas.width, crossCanvas.height);
    }
  } catch (err) {
    // 捕获任何可能发生的错误，并输出错误信息
    console.error("图片加载失败", err);
  }
}
```
### 第五步、设置画布及其他事件监听器

实现`setupEventListeners`事件监听器，用于实现统一管理所有用户交互行为，包括：
> - 按 W 键进入矩形框绘制模式
> - 鼠标拖拽进行矩形标注
> - 支持多边形绘制
> - 双击修改标签
> - 拖拽平移画布（配合 `Ctrl`）
> - 鼠标滚轮缩放（配合 `Ctrl`）
> - 实时更新标注坐标（移动/缩放后自动转换坐标）

我这边再做监听之前先检查一下事件是否重复监听去重操作

```javascript
if (!fCanvas) return;
fCanvas.off("mouse:down"); // 解绑旧的事件，防止重复绑定
```
大概事件监听代码如下：

```javascript

// 绑定事件：平移、缩放
function setupEventListeners() {
  // 如果Fabric画布未初始化，则直接返回
  if (!fCanvas) return;
  // 解绑旧的 mouse:down 监听，避免切换图片的时候叠加上一张图的事件
  fCanvas.off("mouse:down");
  // 键盘监听
  window.addEventListener("keydown", (e) => {
    // 如果按下W键，则开始绘制
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "w" || drawing) {
      // drawing = false;
      fCanvas.selection = false;
    }
  });
  // 鼠标按下
  fCanvas.on("mouse:down", (opt) => {
    const obj = opt.target as any;
    const target = opt.target as any; 
    const e = opt.e as MouseEvent;
    if (!opt.target) {
      // 用户点击画布空白处
     
    } else {
      const obj = opt.target as any;
      if (obj.boxId) {
       // 点击矩形框
      }
    }
    if (!drawingPolygon.value) return;
    const pointer = fCanvas.getPointer(opt.e);
    const point = { x: pointer.x, y: pointer.y };
    currentPolygonPoints.push(point);
    // 创建并添加临时圆点...
    fCanvas.add(circle);
    tempCirclePoints.push(circle);

    // 进行临时连线操作
    ...
      fCanvas.add(line);
      tempLinePoints.push(line);
    }

    // 检测是否闭合（点击第一个点附近）
    if (currentPolygonPoints.length >= 3) {
      const first = currentPolygonPoints[0];
      const dx = point.x - first.x;
      const dy = point.y - first.y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        finalizePolygon();
      }
    }
  });

  // 全部可选项进行双击修改标签内容
  fCanvas.on("mouse:dblclick", (e) => {
  	// 修改标签弹窗
  });

  // 对象单选时也触发
  fCanvas.on("object:modified", (e) => {
    // 当对象进行平移后根据缩放和平移距离精确计算出各个点的位置
  });

  // 监听鼠标按下事件
  fCanvas.on("mouse:down", (opt) => {
   ...
  });

  // 监听鼠标移动事件
  fCanvas.on("mouse:move", (opt) => {
   
  });

  // 监听鼠标抬起事件
  fCanvas.on("mouse:up", (opt) => {
   
  });
  // 监听鼠标滚轮事件且与ctrl配合使用才会生效
  fCanvas.on("mouse:wheel", (opt) => {
    
  });
}
```
### 第六步、 矩形标注实现
拖拽结束后，记录鼠标最后出现位置，弹出标注框。
```javascript
// 创建矩形标注
function createRectangles() {
  drawing = true;
  fCanvas.selection = false;
  fCanvas.defaultCursor = "crosshair";
}

// 绘制矩形逻辑
fCanvas.on("mouse:down", (opt) => {
  if (drawing) {
    const e = opt.e as MouseEvent;
    const p = fCanvas.getPointer(e);
    startX = p.x;
    startY = p.y;
    
    // 创建临时矩形
    tempRect = new Rect({
      left: startX,
      top: startY,
      width: 0,
      height: 0,
      fill: "rgba(123, 217, 31,0.05)",
      stroke: "#7BD91F",
      strokeWidth: 1,
    });
    
    fCanvas.add(tempRect);
  }
});

// 鼠标移动时更新矩形尺寸
fCanvas.on("mouse:move", (opt) => {
  if (drawing && tempRect) {
    const e = opt.e as MouseEvent;
    const p = fCanvas.getPointer(e);
    
    tempRect.set({
      width: Math.abs(p.x - startX),
      height: Math.abs(p.y - startY),
      left: p.x < startX ? p.x : startX,
      top: p.y < startY ? p.y : startY,
    });
    
    tempRect.setCoords();
    fCanvas.requestRenderAll();
  }
});
```
### 第七步、多边形标注实现
我当前是通过点击每个点进行连成线绘制多边形，三个点即可变成一个多边形，当前点数`>3`的时候且第一个点被二次点击的时候代表多边形标注完成，即可进行多边形标注结束。
```javascript
// 多边形绘制模式切换
function createPolygon() {
  drawingPolygon.value = !drawingPolygon.value;
  if (!drawingPolygon.value) {
    clearTempDraw();
  }
}

// 多边形点添加逻辑
fCanvas.on("mouse:down", (opt) => {
  if (!drawingPolygon.value) return;
  
  const pointer = fCanvas.getPointer(opt.e);
  const point = { x: pointer.x, y: pointer.y };
  currentPolygonPoints.push(point);
  
  // 添加控制点
  const circle = new Circle({
    left: point.x,
    top: point.y,
    radius: 3,
    fill: "red",
  });
  
  fCanvas.add(circle);
  tempCirclePoints.push(circle);
  
  // 添加连线
  if (currentPolygonPoints.length > 1) {
    const prev = currentPolygonPoints[currentPolygonPoints.length - 2];
    const line = new Line([prev.x, prev.y, point.x, point.y], {
      stroke: "red",
      strokeWidth: 1,
    });
    
    fCanvas.add(line);
    tempLinePoints.push(line);
  }
});

// 多边形闭合逻辑
function finalizePolygon() {
  currentPolygonPoints.pop();
  
  // 创建多边形对象
  const polygon = new Polygon(currentPolygonPoints, {
    stroke: "red",
    strokeWidth: 1,
    fill: `rgba(149, 204, 100,0.2)`,
    objectCaching: false,
    selectable: true,
  });
  
  fCanvas.add(polygon);
  
  // 添加标签
  const center = polygon.getCenterPoint();
  const tb = new Textbox(label, {
    left: center.x,
    top: center.y,
    fontSize: 16,
    fill: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
  });
  
  fCanvas.add(tb);
  
  // 保存多边形数据
  imageLabelData[currentIndex.value].labelPolygonInfo.push({
    labelText: label,
    id: polygonId,
    circlePoints: [...pointCacheData],
  });
}
```
### 第八步、坐标转换系统
因为图片会进行放大缩小和拖拽移动的问题，我需要将最终点位结果进行计算得出缩放和拖拽前的位置。
```javascript
// 画布坐标转图像原始坐标
function toImageOriginalPos(point: Point) {
  const zoom = fCanvas.getZoom();
  const vpt = fCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];
  
  // 移除画布变换
  const canvasX = (point.x - vpt[4]) / zoom;
  const canvasY = (point.y - vpt[5]) / zoom;
  
  // 转换为相对于图像左上角的坐标
  const relativeX = canvasX - imgLeft;
  const relativeY = canvasY - imgTop;
  
  // 转换为原始图像像素坐标
  return {
    x: (relativeX / img.scaleX!) * zoom,
    y: (relativeY / img.scaleY!) * zoom,
  };
}
```
### 第九步、标签管理

```javascript
// 标签编辑
function startEditLabel(id: string, type?: any) {
  if (type == "rect") {
    const label = imageLabelData[currentIndex.value].labelInfo.find(
      (b: any) => b.id === id
    );
    editLabelText.value = label.labelText;
    editingLabelId.value = id;
    editingLabel.value = true;
  }
}

// 标签删除
function removeBox(id: string) {
  const targets = fCanvas.getObjects().filter((o) => (o as any).boxId === id);
  targets.forEach((o) => {
    fCanvas.remove(o);
  });
  
  imageLabelData[currentIndex.value].labelInfo = imageLabelData[
    currentIndex.value
  ].labelInfo.filter((b) => b.id !== id);
}
```
### 第十步、十字辅助线创建
当时实现的时候都在统一图层里面进行实现的，当完成后发现，我的十字辅助线的功能与我的图片标注一层画布出现了事件冲突，各种冲突问题很难结局，最后决定在`Fabric.js`画布之上创建一个透明的`Canvas`覆盖层，专门用于绘制跟随鼠标的十字线。不会干扰底层`Fabric.js`的画布内容，可以轻松控制十字线的显示/隐藏，独立于`Fabric.js`的渲染机制，性能开销小。具体实现代码如下

1. 创建辅助canvas层

```javascript
function createCrossCanvas(container: HTMLElement) {
  // 检查是否已存在辅助Canvas
  let crossCanvas = container.querySelector<HTMLCanvasElement>(".cross-canvas");
  if (crossCanvas) return crossCanvas;

  // 创建新的Canvas元素
  crossCanvas = document.createElement("canvas");
  crossCanvas.classList.add("cross-canvas");
  
  // 设置Canvas样式
  crossCanvas.style.position = "absolute";
  crossCanvas.style.top = "0";
  crossCanvas.style.left = "0";
  crossCanvas.style.width = "100%";
  crossCanvas.style.height = "100%";
  crossCanvas.style.pointerEvents = "none"; // 关键：允许事件穿透
  crossCanvas.style.zIndex = "9999"; // 确保在最上层
  
  // 添加到容器
  container.appendChild(crossCanvas);

  // 设置Canvas物理尺寸（防止模糊）
  crossCanvas.width = container.clientWidth;
  crossCanvas.height = container.clientHeight;

  return crossCanvas;
}
```
2. 在图像加载时初始化辅助`Canvas`

```javascript
async function loadImage(url: string) {
  // ...其他图像加载逻辑...
  
  // 创建或获取辅助Canvas
  const crossCanvas = createCrossCanvas(container);
  
  // 获取2D绘图上下文
  const ctx = crossCanvas.getContext("2d")!;
  
  // 绑定鼠标移动事件
  container.removeEventListener("mousemove", onMouseMove);
  container.addEventListener("mousemove", onMouseMove);
  
  // 绑定鼠标离开事件
  container.removeEventListener("mouseleave", onMouseLeave);
  container.addEventListener("mouseleave", onMouseLeave);
  
  // ...其他逻辑...
}
```
3. 实现鼠标移动事件处理

```javascript
function onMouseMove(e: MouseEvent) {
  // 计算鼠标在Canvas中的相对位置
  const rect = crossCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // 检查是否应该显示十字线
  if (!isShowCrosshairImpont.value) return;
  if (!isCrosshair.value) return;
  
  // 清除上一帧的绘制
  ctx.clearRect(0, 0, crossCanvas.width, crossCanvas.height);
  
  // 开始绘制新的十字线
  ctx.beginPath();
  ctx.strokeStyle = "#00ff01"; // 亮绿色
  ctx.lineWidth = 0.8; // 细线
  
  // 绘制横线
  ctx.moveTo(0, y);
  ctx.lineTo(crossCanvas.width, y);
  
  // 绘制纵线
  ctx.moveTo(x, 0);
  ctx.lineTo(x, crossCanvas.height);
  
  // 完成绘制
  ctx.stroke();
}
```
4. 实现鼠标离开事件处理
```javascript
function onMouseLeave() {
  // 鼠标离开时清除十字线
  ctx.clearRect(0, 0, crossCanvas.width, crossCanvas.height);
}
```


### 第十一步、自定义控制点
当对象被选中的时候，会出现控制点，`fabric.js`中就支持了自定义控制点，修改回调方法进行自定义控制点。
```javascript
function createCustomControls() {
  return {
    tl: new Control({ /* 左上角控制点配置 */ }),
    tr: new Control({ /* 右上角控制点配置 */ }),
    bl: new Control({ /* 左下角控制点配置 */ }),
    br: new Control({ /* 右下角控制点配置 */ }),
    ml: new Control({ /* 左边中点控制点配置 */ }),
    mr: new Control({ /* 右边中点控制点配置 */ }),
    mt: new Control({ /* 上边中点控制点配置 */ }),
    mb: new Control({ /* 下边中点控制点配置 */ }),
  };
}

// 应用自定义控制点到矩形
rect.controls = createCustomControls();
```
### 第十二步、基于标签文本生成固定颜色
通过哈希散列算法，计算得出固定字符串的固定随机颜色，且再系统中统一。
```javascript
function stringToColour(str, isRgb = true) {
  // 生成MD5哈希值
  const hash = CryptoJS.MD5(str).toString();
  const colour = "#" + hash.substr(0, 6);
  // 转换为RGB格式
  if (isRgb) {
    return {
      r: parseInt(colour.substring(1, 3), 16),
      g: parseInt(colour.substring(3, 5), 16),
      b: parseInt(colour.substring(5, 7), 16)
    };
  }
  return colour;
}
```

### 第十三步、进行矩形的回显绘制
在一开始进入页面后，需要进行矩形与多边形的回显效果，根据后端返回的数据源进行矩形多边形的回显，后端定义好各个点位的固定数据格式信息即可。矩形给出点位可给出【四个顶点坐标，中心坐标】或者【对角坐标和中心坐标】又或者【不给出中心坐标，只给出中心坐标即可】。
```javascript
// 绘制矩形标注框
function drawLabels(labelInfo: typeof labelData.labelInfo, imgObj: any) {
  const imgLeft = imgObj.left!;
  const imgTop = imgObj.top!;
  // 获取偏移量
  const originOffsetX = imgObj.getScaledWidth() / 2;
  const originOffsetY = imgObj.getScaledHeight() / 2;

  labelInfo.forEach((item) => {
    const [x1, y1] = item.pos1.map((v) => v * imgScale);
    const [x2, y2] = item.pos2.map((v) => v * imgScale);

    const left = imgLeft - originOffsetX + x1;
    const top = imgTop - originOffsetY + y1;
    const width = x2 - x1;
    const height = y2 - y1;
    // 获取字符串随机且固定颜色
    const rgbTempColor: any = stringToColour(item.labelText);
    console.log("RGB", rgbTempColor.r, rgbTempColor.g, rgbTempColor.b);
    const rect = new Rect({
      left,
      top,
      width,
      height,
      fill: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0)`, // 填充颜色
      stroke: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`, // 边框颜色
      strokeWidth: 1,
      selectable: true,
      cornerStrokeWidth: 1,
      strokeUniform: true, // 确保缩放时描边宽度不变
      originX: "left",
      originY: "top",
    });
    // 创建文字标签，不加入 group
    const label = new Textbox(item.labelText, {
      left: left,
      top: top, // 👈 显示在矩形上方
      fontSize: 26,
      fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
      editable: false,
      borderColor: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
      selectable: false,
      evented: false, // 不参与事件
    });

    // 自定义控制点
    rect.controls = createCustomControls();

    // 添加元素
    fCanvas.add(rect);
    fCanvas.add(label);

    // 保存 label 引用在 rect 上
    (rect as any).labelRef = label;
    (rect as any).boxId = item.id;
    (label as any).boxId = item.id;

    // 拖动时同步 label 位置
    rect.on("moving", () => {
      const r = rect as any;
      r.labelRef.set({
        left: r.left! + 5,
        top: r.top!,
      });
    });

    // rect.set({ hoverCursor: "pointer" });
    rect.on("mouseover", () => {
      // "rgba(0, 255, 0, 0.2)"
      rect.set(
        "fill",
        `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0.2)`
      );
      fCanvas.renderAll();
    });
    rect.on("mouseout", () => {
      rect.set(
        "fill",
        `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0)`
      );
      fCanvas.renderAll();
    });

    rect.on("mousedown", (e) => {
      // 选中当前 rectSmall 对象
      fCanvas.setActiveObject(rect);
      // 重新渲图——必要，否则选中框不会出现
      fCanvas.requestRenderAll();
      console.log("已选中小矩形", rect);
      const obj: any = e.target as any;
      if (obj && obj.boxId) {
        selectedLabelId.value = obj.boxId;
      }
    });
    // 缩放时同步 label 位置
    rect.on("scaling", () => {
      console.log("scaling被一直执行了");
      const r = rect as any;
      const boundingBox = rect.getBoundingRect(); // 获取绝对左上角
      r.labelRef.set({
        left: r.left! + r.getScaledWidth() / 2 - r.labelRef.width! / 2,
        top: r.top!,
      });
    });

    // 初始化坐标
    rect.setCoords();
  });
  fCanvas.requestRenderAll();
}
```

### 第十四步、矩形及多边形绘制结束label弹窗
多边形绘制结束后，记录鼠标在当前画布中的位置，在记录位置中弹出`label`窗体进行定义标签类型。
```javascript
// 矩形弹出新建标签输入
function promptLabelEditor(rect: Rect) {
  // 创建一个input
  const wrapper = canvas.value!.parentElement! as HTMLElement;
  // 创建一个div
  const div = document.createElement("div");
  // / 设置div的样式
  div.style.position = "absolute";
  div.style.left = `${startPos.x! - 122}px`;
  div.style.top = `${startPos.y!}px`;
  div.style.background = "white";
  div.style.padding = "4px";
  div.innerHTML = `
      <input type="text" placeholder="请输入Label" style="width:100px"/>
      <button data-action="ok">创建</button>
      <button data-action="cancel">取消</button>
    `;

  // 添加到画布
  wrapper.append(div);
  // 选中input输入框
  const input = div.querySelector("input") as HTMLInputElement;
  // 让输入框获取焦点
  input.focus();
  // 移除临时的矩形
  const cleanup = () => {
    // 移除临时的矩形
    wrapper.removeChild(div);
    tempRect = null;
  };

  // 监听点击事件
  div.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).dataset.action;
    if (btn === "ok") {
      const label = input.value.trim();
      if (label) addLabeledRect(rect, label);
      // 移除临时的矩形
      cleanup();
    } else if (btn === "cancel") {
      fCanvas.remove(rect);
      // 移除临时的矩形

      cleanup();
      // 打开十字控制线
      isCrosshair.value = true;
    }
  });
}
```
### 第十五步、根据数据源回显多边形

> `labelText`：标签内容。
> `id`：当前对象唯一标识。
> `circlePoints`：多边形的点位详细信息。

数据格式如下：
```javascript
let imageLabelData: any = reactive([
  {
    imgurl: "http://192.168.80.32:8888/zq.jpeg",
    labelInfo: [] as LabelInfo[],
    labelPolygonInfo: [
      {
        labelText: "10号球员",
        id: "box_1754903425594",
        circlePoints: [
          [
            { x: 869.9902698710292, y: 2355.0001879442193 },
            { x: 748.9829665322839, y: 2396.397423296948 },
            { x: 586.5784278408101, y: 2323.1561607498134 },
            { x: 280.8757667745062, y: 2233.9928846054736 },
            { x: 233.10972598289615, y: 1921.921418100289 },
            { x: 287.2445722133874, y: 1667.1692005450361 },
            { x: 350.93262660220086, y: 1498.3958564146808 },
            { x: 430.54269458821756, y: 1310.5160959676812 },
            { x: 519.7059707325561, y: 1129.0051409595635 },
            { x: 659.8196903879452, y: 1052.5794756929874 },
            { x: 787.195799165572, y: 969.7850049875302 },
            { x: 793.5646046044533, y: 794.6428554182937 },
            { x: 860.4370617127074, y: 638.6071221657011 },
            { x: 971.8911568931306, y: 597.2098868129724 },
            { x: 1070.607641195791, y: 597.2098868129724 },
            { x: 1166.1397227790112, y: 654.5291357629046 },
            { x: 1217.0901662900615, y: 727.7703983100399 },
            { x: 1201.1681526928583, y: 816.9336744543782 },
            { x: 1201.1681526928583, y: 909.2813533181577 },
            { x: 1185.246139095655, y: 998.4446294624961 },
            { x: 1159.7709173401297, y: 1065.31708657075 },
            { x: 1127.926890145723, y: 1148.1115572762076 },
            { x: 1032.3948085625032, y: 1189.5087926289361 },
            { x: 1000.5507813680963, y: 1224.5372225427836 },
            { x: 994.181975929215, y: 1355.0977340398508 },
            { x: 1022.8416004041812, y: 1482.473842817477 },
            { x: 1035.5792112819438, y: 1603.4811461562226 },
            { x: 1045.132419440266, y: 1673.5380059839174 },
            { x: 1108.8204738290792, y: 1740.4104630921713 },
            { x: 1204.3525554122991, y: 1778.623295725459 },
            { x: 1382.679107700976, y: 1874.155377308679 },
            { x: 1481.395592003637, y: 1899.630599064204 },
            { x: 1624.6937143784667, y: 1899.630599064204 },
            { x: 1720.2257959616863, y: 1953.7654452946954 },
            { x: 1761.6230313144154, y: 2007.9002915251872 },
            { x: 1767.9918367532969, y: 2093.879164950085 },
            { x: 1710.6725878033646, y: 2151.198413900017 },
            { x: 1627.8781170979075, y: 2163.93602477778 },
            { x: 1430.4451484925862, y: 2065.219540475119 },
            { x: 1408.1543294565015, y: 2135.2764003028137 },
            { x: 1382.679107700976, y: 2288.127730835965 },
            { x: 1290.331428837197, y: 2504.6671157579303 },
            { x: 1150.2177091818075, y: 2676.6248626077263 },
            { x: 1086.5296547929943, y: 2791.2633605075907 },
            { x: 1182.0617363762142, y: 2899.533052968573 },
            { x: 1283.9626233983156, y: 3042.831175343403 },
            { x: 1293.515831556638, y: 3131.994451487741 },
            { x: 1137.480098304045, y: 3157.4696732432667 },
            { x: 809.4866182016564, y: 3141.5476596460635 },
            { x: 717.1389393378772, y: 3109.703632451657 },
            { x: 752.1673692517244, y: 3014.171550868437 },
            { x: 717.1389393378772, y: 2915.455066565776 },
            { x: 803.1178127627751, y: 2800.816568665912 },
            { x: 809.4866182016564, y: 2698.9156816438112 },
            { x: 812.6710209210972, y: 2536.511142952337 },
            { x: 847.6994508349445, y: 2450.532269527439 },
          ],
        ],
      },
    ] as any,
  },
  {
    imgurl: "http://192.168.80.32:8888/286_Coax_67480501_SourceImg.jpg",
    labelInfo: [
      {
        labelText: "猫",
        pos1: [0, 0],
        pos2: [500, 500],
        id: "box-1",
      },
    ] as LabelInfo[],
    labelPolygonInfo: [],
  },
]);
```
根据以上数据格式绘制多边形代码，通过`forEach`遍历，进行绘制多个多边形。
```javascript
// 绘制多边形标注框
function drawPolygons(labelPolygonInfo: any[], imgObj: any) {
  const imgLeft = imgObj.left!;
  const imgTop = imgObj.top!;
  const imgDisplayWidth = imgObj.getScaledWidth();
  const imgDisplayHeight = imgObj.getScaledHeight();

  const imgBaseLeft = imgLeft - imgDisplayWidth / 2;
  const imgBaseTop = imgTop - imgDisplayHeight / 2;
  labelPolygonInfo.forEach((poly) => {
    const points = poly.circlePoints[0].map((p: any) => ({
      x: imgBaseLeft + p.x * imgObj.scaleX,
      y: imgBaseTop + p.y * imgObj.scaleY,
    }));

    const rgbTempColor: any = stringToColour(poly.labelText);

    const polygon = new Polygon(points, {
      fill: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.01)`,
      stroke: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
      strokeWidth: 1,
      selectable: true,
      objectCaching: false,
      strokeUniform: true,
      evented: true,
      hasControls: false,
      hasBorders: false,
      perPixelTargetFind: true,
      noScaleCache: true,
    });

    const label = new Textbox(poly.labelText, {
      fontSize: 16,
      fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
      editable: false,
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
    });

    (polygon as any).labelRef = label;
    (polygon as any).boxId = poly.id;
    (label as any).boxId = poly.id;
    (polygon as any).id = poly.id;
    (label as any).id = poly.id;

    // 绑定多边形和标签的关系
    (polygon as any).label = label;

    // 更新标签位置函数
    function updateLabelPosition() {
      const center = polygon.getCenterPoint();
      label.set({
        left: center.x,
        top: center.y,
        angle: polygon.angle || 0,
      });
      label.setCoords();
      fCanvas.requestRenderAll();
    }

    // 绑定标签位置同步事件
    polygon.on("moving", updateLabelPosition);
    polygon.on("scaling", updateLabelPosition);
    polygon.on("rotating", updateLabelPosition);

    // 监听多边形修改事件，实时更新数据
    polygon.on("modified", () => {
      console.log("modified", polygon);
      updatePolygonData(polygon);
    });

    // 双击进入/退出顶点编辑模式
    polygon.on("mousedblclick", () => {
      if (editingPolygon === polygon) {
        exitVertexEditing(polygon);
      } else {
        if (editingPolygon) exitVertexEditing(editingPolygon);
        enterVertexEditing(polygon);
      }
    });

    // 鼠标事件，设置激活对象和选中ID
    polygon.on("mousedown", (e) => {
      fCanvas.setActiveObject(polygon);
      fCanvas.requestRenderAll();
      const obj: any = e.target;
      if (obj && obj.boxId) {
        selectedLabelId.value = obj.boxId;
      }
    });

    // 设置默认样式（你之前代码里重复设置了多次，这里统一放）
    polygon.set({
      fill: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.2)`,
      borderColor: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 1)`,
      stroke: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 1)`,
    });

    // 鼠标悬浮改变填充透明度，提升交互体验
    polygon.on("mouseover", () => {
      polygon.set(
        "fill",
        `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.2)`
      );
      fCanvas.renderAll();
    });

    polygon.on("mouseout", () => {
      polygon.set(
        "fill",
        `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.01)`
      );
      fCanvas.renderAll();
    });

    // 添加多边形和标签到画布
    fCanvas.add(polygon);
    fCanvas.add(label);

    polygon.setCoords();
    updateLabelPosition();
  });

  fCanvas.requestRenderAll();
}

```

![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/6a6c0da89c8e4de08b9b33fef8106e0a.gif)
### 第十六步、导出数据格式及其数据

```javascript
let imageLabelData: any = reactive([
  {
    imgurl: "http://192.168.80.32:8888/zq.jpeg",
    labelInfo: [] as LabelInfo[],
    labelPolygonInfo: [] as any,
  },
  {
    imgurl: "http://192.168.80.32:8888/286_Coax_67480501_SourceImg.jpg",
    labelInfo: [
      {
        labelText: "猫",
        pos1: [0, 0],
        pos2: [500, 500],
        id: "box-1",
      },
    ] as LabelInfo[],
    labelPolygonInfo: [],
  },
]);
```

![Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/e2cd113863a74d2eb76b8a1b83340ba3.png)

### 完结~
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/9563233286c74e0bb969b7134fbb6342.png)


![Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/201433018e044adf93b8b0b1bf4f9425.png)

## 优化进行中~ 关注我不定时进行代码优化与功能添加

### 优化一、添加标注的复制粘贴功能
1. 定义一个变量，用来当作剪贴板，将复制的内容赋值给该变量，铜鼓粘贴按钮进行数据复制后的粘贴操作。

![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/2c8fe1f3173a4ce08a798ca0a0ff6871.png)

```javascript
const clipboard = ref<any>(null); // 存储复制的标注
const pastePosition = ref({ x: 0, y: 0 }); // 粘贴的初始位置
```

2. 添加复制粘贴逻辑
`copyAnnotation()`与`pasteAnnotation()`方法如下：
```javascript

const clipboard = ref<any>(null); // 存储复制的标注
const pastePosition = ref({ x: 0, y: 0 }); // 粘贴的初始位置

function copyAnnotation() {
  const activeObj: any = fCanvas.getActiveObject();
  if (!activeObj) {
    return ElMessage.warning("请先选择要复制的标注");
  }

  const id = activeObj.boxId || activeObj.id;

  // 更准确判断类型
  const isRect = activeObj.type === "rect" || activeObj.type === "group";
  const isPolygon = activeObj.type === "polygon";

  let type: "rect" | "polygon";
  if (isRect) type = "rect";
  else if (isPolygon) type = "polygon";
  else {
    // 备用判断：看 id 在哪个标注数据中
    const inRect = imageLabelData[currentIndex.value].labelInfo.some(
      (i: any) => i.id === id
    );
    type = inRect ? "rect" : "polygon";
  }

  if (type === "rect") {
    const rectData = imageLabelData[currentIndex.value].labelInfo.find(
      (i: any) => i.id === id
    );
    if (!rectData) {
      return ElMessage.error("未找到矩形数据");
    }
    clipboard.value = {
      type: "rect",
      data: JSON.parse(JSON.stringify(rectData)),
    };
    ElMessage.success("矩形标注已复制");
  } else {
    const polyData = imageLabelData[currentIndex.value].labelPolygonInfo.find(
      (i: any) => i.id === id
    );
    if (!polyData) {
      return ElMessage.error("未找到多边形数据");
    }
    clipboard.value = {
      type: "polygon",
      data: JSON.parse(JSON.stringify(polyData)),
    };
    ElMessage.success("多边形标注已复制");
  }
}

// 粘贴矩形标注
function pasteRectAnnotation() {
  const rectData = clipboard.value.data;
  const newId = `box_${Date.now()}`;
  // 1. 获取图片对象
  const img = fCanvas.getObjects("image")[0] as FabricImage;
  if (!img) {
    ElMessage.error("未找到图片对象");
    return;
  }

  // 2. 获取图片在画布中的实际位置和缩放
  const imgDisplayWidth = img.width! * img.scaleX!;
  const imgDisplayHeight = img.height! * img.scaleY!;
  const imgCenterX = img.left!;
  const imgCenterY = img.top!;
  const imgBaseLeft = imgCenterX - imgDisplayWidth / 2;
  const imgBaseTop = imgCenterY - imgDisplayHeight / 2;

  // 3. 坐标转换函数：原始图片坐标 → 画布坐标
  const toCanvasPos = (point: [number, number]) => {
    return {
      x: imgBaseLeft + point[0] * img.scaleX!,
      y: imgBaseTop + point[1] * img.scaleY!,
    };
  };

  // 4. 转换坐标
  const pos1Canvas = toCanvasPos(rectData.pos1);
  const pos2Canvas = toCanvasPos(rectData.pos2);

  // 5. 计算矩形尺寸（画布坐标系）
  const width = Math.abs(pos2Canvas.x - pos1Canvas.x);
  const height = Math.abs(pos2Canvas.y - pos1Canvas.y);

  // 6. 创建矩形（使用转换后的坐标）

  // 7. 添加标签（使用转换后的位置）
  const rgbTempColor: any = stringToColour(rectData.labelText);
  const rect = new Rect({
    left: Math.min(pos1Canvas.x, pos2Canvas.x) + 10,
    top: Math.min(pos1Canvas.y, pos2Canvas.y) + 10,
    width: width,
    height: height,
    fill: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0)`, // 填充颜色
    stroke: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`, // 边框颜色
    strokeWidth: 1,
    selectable: true,
    evented: true,
    cornerStrokeWidth: 1,
    strokeUniform: true,
    subTargetCheck: true,
    type: "rect",
  });

  const tb = new Textbox(rectData.labelText, {
    left: Math.min(pos1Canvas.x, pos2Canvas.x) + 10,
    top: Math.min(pos1Canvas.y, pos2Canvas.y) + 10,
    fontSize: 26,
    fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
    editable: false,
    borderColor: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
    selectable: false,
    evented: false,
  });

  // 8. 自定义控制点
  rect.controls = createCustomControls();

  // 9. 创建组
  // const group = new Group([rect], {
  //   selectable: true,
  //   evented: true,
  //   subTargetCheck: true,
  // });
  // group.controls = createCustomControls();

  // (group as any).boxId = newId;
  // (group as any).id = newId;
  (rect as any).boxId = newId;
  (tb as any).boxId = newId;
  (rect as any).id = newId;
  (tb as any).id = newId;

  // 10. 添加到画布
  // fCanvas.add(group);
  fCanvas.add(rect);
  fCanvas.add(tb);

  // 11. 添加到数据源（存储原始图片坐标）
  imageLabelData[currentIndex.value].labelInfo.push({
    ...rectData,
    id: newId,
    pos1: [rectData.pos1[0] + 10, rectData.pos1[1] + 10], // 保持原始图片坐标
    pos2: [rectData.pos2[0] + 10, rectData.pos2[1] + 10], // 保持原始图片坐标
  });

  // 12. 设置事件监听
  rect.on("moving", () => {
    const boundingBox = rect.getBoundingRect();
    tb.set({
      left: boundingBox.left,
      top: boundingBox.top,
    });
  });

  rect.on("mousedown", (e) => {
    const obj: any = e.target;
    if (obj && obj.boxId) {
      selectedLabelId.value = obj.boxId;
    }
  });

  rect.on("mousedown", (e) => {
    // 选中当前 rectSmall 对象
    fCanvas.setActiveObject(rect);
    // 重新渲图——必要，否则选中框不会出现
    fCanvas.requestRenderAll();
    console.log("已选中小矩形", rect);
    const obj: any = e.target as any;
    if (obj && obj.boxId) {
      selectedLabelId.value = obj.boxId;
    }
  });

  rect.on("scaling", () => {
    const boundingBox = rect.getBoundingRect();
    tb.set({
      left: boundingBox.left,
      top: boundingBox.top,
    });
  });

  ElMessage.success("矩形标注已粘贴");
}

// 粘贴多边形标注
function pastePolygonAnnotation() {
  const polygonData = clipboard.value.data;
  const newId = `box_${Date.now()}`;

  // 1. 获取图片对象
  const img = fCanvas.getObjects("image")[0] as FabricImage;
  if (!img) {
    ElMessage.error("未找到图片对象");
    return;
  }

  // 2. 坐标转换函数：原始图片坐标 → 画布坐标
  const toCanvasPos = (point: { x: number; y: number }) => {
    const imgDisplayWidth = img.width! * img.scaleX!;
    const imgDisplayHeight = img.height! * img.scaleY!;
    const imgBaseLeft = img.left! - imgDisplayWidth / 2;
    const imgBaseTop = img.top! - imgDisplayHeight / 2;
    return {
      x: imgBaseLeft + point.x * img.scaleX!,
      y: imgBaseTop + point.y * img.scaleY!,
    };
  };

  // 3. 偏移量（右下 10px）
  const offsetX = 10;
  const offsetY = 10;

  // 4. 把原始图片坐标转换到画布坐标，并加偏移
  const pointsCanvas = polygonData.circlePoints.map((p: any) => {
    const pos = toCanvasPos(p);
    return { x: pos.x + offsetX, y: pos.y + offsetY };
  });

  // 5. 创建多边形
  const rgbTempColor: any = stringToColour(polygonData.labelText);
  const polygon = new Polygon(pointsCanvas, {
    fill: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.01)`,
    stroke: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
    strokeWidth: 1,
    selectable: true,
    objectCaching: false,
    strokeUniform: true,
    evented: true,
    hasControls: false,
    hasBorders: false,
    perPixelTargetFind: true,
    noScaleCache: true,
    type: "polygon",
  });

  // 6. 创建标签
  const label = new Textbox(polygonData.labelText, {
    fontSize: 16,
    fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
    editable: false,
    selectable: false,
    evented: false,
    originX: "center",
    originY: "center",
  });

  // 关键修改：将文本标签与多边形关联
  (polygon as any).label = label;

  polygon.set({ id: newId });
  label.set({ id: newId });

  // 7. 添加到画布
  fCanvas.add(polygon);
  fCanvas.add(label);

  // 8. 更新标签位置（用多边形中心点）
  const center = polygon.getCenterPoint();
  label.set({
    left: center.x,
    top: center.y,
  });

  // 9. 添加到数据源（存储原始图片坐标，加同样偏移）
  imageLabelData[currentIndex.value].labelPolygonInfo.push({
    ...polygonData,
    id: newId,
    circlePoints: polygonData.circlePoints.map((p: any) => ({
      x: p.x + offsetX,
      y: p.y + offsetY,
    })),
  });

  // 10. 事件监听
  polygon.on("modified", () => {
    updatePolygonData(polygon);
  });

  polygon.on("mousedblclick", () => {
    if (editingPolygon === polygon) {
      exitVertexEditing(polygon);
    } else {
      if (editingPolygon) exitVertexEditing(editingPolygon);
      enterVertexEditing(polygon);
    }
  });

  polygon.on("moving", () => {
    const center = polygon.getCenterPoint();
    label.set({
      left: center.x,
      top: center.y,
    });
    fCanvas.requestRenderAll();
  });

  polygon.on("scaling", () => {
    const center = polygon.getCenterPoint();
    label.set({
      left: center.x,
      top: center.y,
    });
    fCanvas.requestRenderAll();
  });

  polygon.on("mousedown", (e) => {
    fCanvas.setActiveObject(polygon);
    fCanvas.requestRenderAll();
    const obj: any = e.target;
    if (obj && obj.id) {
      selectedLabelId.value = obj.id;
    }
  });

  // 11. 更新下次粘贴的初始位置
  pastePosition.value = {
    x: pastePosition.value.x + offsetX,
    y: pastePosition.value.y + offsetY,
  };

  ElMessage.success("多边形标注已粘贴（右下偏移10px）");
}

function pasteAnnotation() {
  if (!clipboard.value) {
    ElMessage.warning("剪贴板中没有标注");
    return;
  }

  // 记录粘贴位置（画布中心）
  pastePosition.value = {
    x: fCanvas.getWidth() / 2,
    y: fCanvas.getHeight() / 2,
  };
  console.log("粘贴位置:", clipboard.value.type);
  if (clipboard.value.type === "rect") {
    pasteRectAnnotation();
  } else if (clipboard.value.type === "polygon") {
    pastePolygonAnnotation();
  }
}
```
效果：
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/a1e5cd4531eb46bfaced0665d833eb47.gif)
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/746b7710b8954dd6af20c2944adf088d.png)

### 优化二、添加不规则多边形规则处理
有的客户在进行创建多边形的时候，可能会出现不规则的多边形，添加一个配置方法，是否规则化多边形开关，如果打开状态，会将在创建多边形后进行自动规则化，如下图，将交叉多边形经过中心角度对比排序后规则化多边形。
下图中，左边是不规则多边形，右边是规则化后的多边形：
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/5b2d8a0967634a5383c3e11a85d78c35.png)
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/5cbe25cc434f44cea1122600eff3e210.png)
规则多边形测试没有影响：

![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具【下】](https://i-blog.csdnimg.cn/direct/aa63a7e1929a423ea029aa6644438de3.png)
实现思路：

> 找出所有点的中心点也就是【质心/平均坐标】，计算每个点相对于中心点的角度【atan2(y - cy, x - cx)】，按照角度从小到大排序，用排序后的点来绘制多边形，就会使规则不交叉的形状。

实现方法：
```typescript
/**
 *
 * @param sortPointsToPolygon
 * 1. 找出所有点的中心点（质心 / 平均坐标）。
 * 2. 计算每个点相对于中心点的角度 atan2(y - cy, x - cx)。
 * 3. 按角度从小到大排序。
 * 4. 用排序后的点来绘制多边形，就会是规则（不交叉）的形状。
 */
function sortPointsToPolygon(points: { x: number; y: number }[]) {
  // 1. 计算质心
  const center = points.reduce(
    (acc, p) => {
      acc.x += p.x;
      acc.y += p.y;
      return acc;
    },
    { x: 0, y: 0 }
  );
  center.x /= points.length;
  center.y /= points.length;

  // 2. 计算角度并排序
  return points
    .map((p) => ({
      ...p,
      angle: Math.atan2(p.y - center.y, p.x - center.x),
    }))
    .sort((a, b) => a.angle - b.angle)
    .map(({ x, y }) => ({ x, y })); // 返回排序后的点
}
```
根据按钮配置是否规则化
```typescript
<div class="menu-item" style="text-align: center">
  <el-switch
    style="margin-left: -15px"
    v-model="regularPolygon"
    active-color="#9AC8E0"
    inactive-color="#E8E8E8"
  />
  <div class="menu-item-text">是否规则多边形</div>
</div>
```

在结束多边形绘制和图片初始化绘制的时候，进行判断是否规则化，如果规则化则调用`sortPointsToPolygon`方法规则化。
`finalizePolygon`代码修改：
```typescript
// 4. 将每个点转换到画布绝对坐标
  const absPoints = pts.map((p) => {
    const relative = {
      x: p.x - polyTemp.pathOffset.x,
      y: p.y - polyTemp.pathOffset.y,
    };
    return util.transformPoint(relative, matrix); // :contentReference[oaicite:2]{index=2}
  });
  // sortPointsToPolygon(poly.circlePoints)
  // console.log("------------", absPoints);
  let tempPointArr: any = absPoints;
  if (regularPolygon.value) {
    tempPointArr = sortPointsToPolygon(absPoints);
  }
  // 5. 创建真正用于标注的多边形对象
  const finalPoly = new Polygon(tempPointArr, {
    stroke: "red",
    strokeWidth: 1,
    fill: `rgba(149, 204, 100,0.2)`,
    objectCaching: false,
    selectable: true,
    evented: true,
    hasControls: false, // 初始不显示控制点
    hasBorders: false,
    strokeUniform: true,
    perPixelTargetFind: true,
    noScaleCache: true,
  });
```
初始化绘制的时候调用`sortPointsToPolygon`方法，修改`drawPolygons`方法：

```typescript
  labelPolygonInfo.forEach((poly) => {
    let tempPointArr = poly.circlePoints;
    if (regularPolygon.value) {
      tempPointArr = sortPointsToPolygon(poly.circlePoints);
    }
    const points = tempPointArr.map((p: any) => ({
      x: imgBaseLeft + p.x * imgObj.scaleX,
      y: imgBaseTop + p.y * imgObj.scaleY,
    }));

    const rgbTempColor: any = stringToColour(poly.labelText);

    const polygon = new Polygon(points, {
      fill: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.01)`,
      stroke: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
      strokeWidth: 1,
      selectable: true,
      objectCaching: false,
      strokeUniform: true,
      evented: true,
      hasControls: false,
      hasBorders: false,
      perPixelTargetFind: true,
      noScaleCache: true,
    });

    const label = new Textbox(poly.labelText, {
      fontSize: 16,
      fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
      editable: false,
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
    });

    (polygon as any).labelRef = label;
    (polygon as any).boxId = poly.id;
    (label as any).boxId = poly.id;
    (polygon as any).id = poly.id;
    (label as any).id = poly.id;

    // 绑定多边形和标签的关系
    (polygon as any).label = label;

    // 更新标签位置函数
    function updateLabelPosition() {
      const center = polygon.getCenterPoint();
      label.set({
        left: center.x,
        top: center.y,
        angle: polygon.angle || 0,
      });
      label.setCoords();
      fCanvas.requestRenderAll();
    }

    // 绑定标签位置同步事件
    polygon.on("moving", updateLabelPosition);
    polygon.on("scaling", updateLabelPosition);
    polygon.on("rotating", updateLabelPosition);

    // 监听多边形修改事件，实时更新数据
    polygon.on("modified", () => {
      console.log("modified", polygon);
      updatePolygonData(polygon);
    });

    // 双击进入/退出顶点编辑模式
    polygon.on("mousedblclick", () => {
      if (editingPolygon === polygon) {
        exitVertexEditing(polygon);
      } else {
        if (editingPolygon) exitVertexEditing(editingPolygon);
        enterVertexEditing(polygon);
      }
    });

    // 鼠标事件，设置激活对象和选中ID
    polygon.on("mousedown", (e) => {
      fCanvas.setActiveObject(polygon);
      fCanvas.requestRenderAll();
      const obj: any = e.target;
      if (obj && obj.boxId) {
        selectedLabelId.value = obj.boxId;
      }
    });

    // 设置默认样式（你之前代码里重复设置了多次，这里统一放）
    polygon.set({
      fill: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.2)`,
      borderColor: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 1)`,
      stroke: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 1)`,
    });

    // 鼠标悬浮改变填充透明度，提升交互体验
    polygon.on("mouseover", () => {
      polygon.set(
        "fill",
        `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.2)`
      );
      fCanvas.renderAll();
    });

    polygon.on("mouseout", () => {
      polygon.set(
        "fill",
        `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b}, 0.01)`
      );
      fCanvas.renderAll();
    });

    // 添加多边形和标签到画布
    fCanvas.add(polygon);
    fCanvas.add(label);

    polygon.setCoords();
    updateLabelPosition();
  });

```
效果：
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/d69280ec10154d03aafb935a7280f06b.gif)

### 优化三、多边形创建交互优化【防呆处理】
第一版本的创建多边形为创建联临时点临时线非常死板，经过思考借鉴其他多边形的标注，采用临时多边形和根据最后一个点的鼠标移动位置动态临时多边形，通过按`esc`取消创建多边形。
优化代码为`setupEventListeners()`方法中的鼠标按下及其`esc`键监听。

```typescript

  // 监听键盘按下
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawingPolygon.value) {
      drawingPolygon.value = false;
      currentPolygonPoints = [];
      clearTempDraw(); // 退出绘制时清除所有临时点
    }
  });

  // 监听鼠标右键
  fCanvas.on("mouse:down", (opt) => {
    const e = opt.e as MouseEvent;
    if (e.button === 2 && drawingPolygon.value) {
      // 鼠标右键取消
      cancelPolygonDrawing();
    }
  });
  // 鼠标按下
  fCanvas.on("mouse:down", (opt) => {
    const obj = opt.target as any;
    const target = opt.target as any;
    const e = opt.e as MouseEvent;
    if (!opt.target) {
      // 用户点击画布空白处
      fCanvas.discardActiveObject();
      fCanvas.requestRenderAll();
      selectedLabelId.value = null; // 清空高亮
    } else {
      const obj = opt.target as any;
      if (obj.boxId) {
        selectedLabelId.value = obj.boxId; // 点击矩形框
      }
    }
    if (!drawingPolygon.value) return;

    const pointer = fCanvas.getPointer(e);
    const point = { x: pointer.x, y: pointer.y };

    // 第一个点点击时开始绘制
    if (currentPolygonPoints.length === 0) {
      currentPolygonPoints.push(point);
      addTempCircle(point);
      return;
    }

    // 如果点击第一个点附近且点数 >=3，闭合多边形
    const first = currentPolygonPoints[0];
    if (currentPolygonPoints.length >= 3 && distance(point, first) < 10) {
      finalizePolygon();
      return;
    }

    // 否则正常添加新点
    currentPolygonPoints.push(point);
    addTempCircle(point);
    addTempLine();
  });
```
将添加临时矩形抽出为单独方法如下：

```typescript
function addTempCircle(point: any) {
  const circle = new Circle({
    left: point.x,
    top: point.y,
    radius: 3,
    fill: "red",
    selectable: false,
    originX: "center",
    originY: "center",
  });
  fCanvas.add(circle);
  tempCirclePoints.push(circle);
}

function addTempLine() {
  const len = currentPolygonPoints.length;
  if (len < 2) return;
  const last = currentPolygonPoints[len - 2];
  const curr = currentPolygonPoints[len - 1];
  const line = new Line([last.x, last.y, curr.x, curr.y], {
    stroke: "red",
    strokeWidth: 1,
    selectable: false,
  });
  fCanvas.add(line);
  tempLinePoints.push(line);
}

function distance(p1: any, p2: any) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```
效果：
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/c372a2ef92af42ec97e9a8d30a707dee.gif)
### 优化四、添加标注结果导出图片功能

根据ID找到对应的标注，然后连同标注区域与背景图一并剪切保存为图片。

```typescript
<el-button
class="delete-btn"
 type="primary"
 @click="exportDefect(item.id)"
 >导出</el-button>
```
编辑`exportDefect()`方法逻辑

```typescript
//---------------导出标注瑕疵开始-------------------
function exportDefect(defectId: string | number) {
  const target = fCanvas.getObjects().find((obj: any) => {
    const isWanted =
      obj.type === "rect" || obj.type === "polygon" || obj.type === "group";
    const sameId = obj.boxId === defectId || obj.id === defectId;
    return isWanted && sameId;
  }) as any;

  if (!target) {
    console.error("未找到对应的缺陷标注");
    return;
  }

  const measureObj =
    target.type === "group" && (target as any).mainRect
      ? (target as any).mainRect
      : target;

  // 确保坐标更新
  measureObj.setCoords();

  // 1) 在“画布坐标系”下计算包围盒
  const br = measureObj.getBoundingRect(true, true);
  const PAD = 2; // 安全边距，避免边缘被截断
  const left = br.left - PAD;
  const top = br.top - PAD;
  const width = br.width + PAD * 2;
  const height = br.height + PAD * 2;

  // 2) 将画布坐标变换到 viewport（当前屏幕/渲染）坐标
  //    viewportTransform 格式为 [a, b, c, d, e, f]，变换规则：
  //    x' = a * x + c * y + e
  //    y' = b * x + d * y + f
  const vpt = fCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];
  const transformPoint = (pt: { x: number; y: number }, t: number[]) => ({
    x: t[0] * pt.x + t[2] * pt.y + t[4],
    y: t[1] * pt.x + t[3] * pt.y + t[5],
  });

  const tl = transformPoint({ x: left, y: top }, vpt);
  const brP = transformPoint({ x: left + width, y: top + height }, vpt);

  const leftV = Math.floor(tl.x);
  const topV = Math.floor(tl.y);
  const widthV = Math.ceil(brP.x - tl.x);
  const heightV = Math.ceil(brP.y - tl.y);

  // fCanvas.renderAll();

  // 3) 用变换后的 viewport 坐标调用 toDataURL（这样 toDataURL 内部的 viewport 应与我们一致）
  const dataURL = fCanvas.toDataURL({
    format: "png",
    quality: 1,
    left: leftV,
    top: topV,
    width: widthV,
    height: heightV,
    multiplier: 3, // 倍率渲染，值越大导出越清晰
    enableRetinaScaling: false, // 避免和设备 DPR 冲突
  });

  downloadImage(dataURL, `defect-${defectId}-${Date.now()}.png`);
}

// 下载图片
function downloadImage(dataURL: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// --------------导出标注瑕疵结束-------------------
```

效果：
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/a95c7454256f45fd9b7c60709dbb8bc4.gif)

### 优化五、创建多边形方式优化
标注发现，多边形的点线标注过于死板，将其优化为动态临时多边形创建，创建多边形临时点线改为临时多边形，且临时多边形最后一个点跟着鼠标变换，判断点数`>2`如果`>2`则进行创建临时多边形。
```typescript
// 使用自定义的节流函数
  fCanvas.on("mouse:move", function (opt) {
    // 你的 mouse:move 事件处理逻辑
    const pointerA: any = fCanvas.getPointer(opt.e);
    console.log(pointerA.x, pointerA.y);
    const e = opt.e as MouseEvent;
    startPos.x = e.clientX;
    startPos.y = e.clientY;
    // 绘制中
    if (drawing && tempRect) {
      // 获取鼠标位置
      const p = fCanvas.getPointer(e);
      // 设置矩形的宽高和位置
      tempRect.set({
        width: Math.abs(p.x - startX),
        height: Math.abs(p.y - startY),
        left: p.x < startX ? p.x : startX,
        top: p.y < startY ? p.y : startY,
      });
      // 设置矩形的坐标
      tempRect.setCoords();
      // 请求重新渲染
      console.log("防抖处理");
      fCanvas.requestRenderAll();
      // fCanvas.renderAll();
    } else if (isPanning) {
      // 拖拽中
      fCanvas.relativePan(new Point(e.clientX - lastX, e.clientY - lastY));
      // 记录最后位置
      lastX = e.clientX;
      lastY = e.clientY;
    }
```
效果：
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/26e828d4623747b0b4c6b42877eeda41.gif)
### 优化六、创建标注框的标签方式优化
由以往的输入标签的方式，改为可以自行创建导入的下拉选择方式进行下拉选择标注。
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/35f8ea9cfc5943ada00d13bd479c70ac.gif)
### 优化七、解决超大图放大后绘制卡顿问题
由于在完成标注功能的时候，进行了大量画布以及系统事件的监听，所以每次切换图片和进入都需要进行销毁监听的事件。保证矩形多边形的流畅度。注意：当图片放大很多倍的时候，`fabric.js`会模拟真实像素也会导致卡顿问题，为解决这个问题，少用`fCanvas.renderAll();`多用`fCanvas.requestRenderAll();`
解释：

在 `Fabric.js `中，`fCanvas.requestRenderAll()`和`fCanvas.renderAll()`的主要区别在于渲染方式：

渲染方式
> `‌renderAll()‌`：同步渲染画布，立即重新绘制所有内容。适用于需要立即更新画布的场景，例如添加、删除或修改对象时。 ‌
> `‌requestRenderAll()‌`：异步渲染，将渲染任务安排到浏览器的下一帧重绘周期。适用于频繁更新画布的场景，可减少重复渲染次数，提升性能。

 ‌
使用场景
> `‌renderAll()‌`：当对象状态变化需要立即反映到用户界面时（如实时编辑），应优先使用。 ‌
> `‌requestRenderAll()‌`：在高频更新（如动画、连续操作）时，建议使用以避免性能问题。 ‌

性能优化

> `requestRenderAll()`通过延迟渲染减少CPU压力，适合复杂交互场景；`renderAll()`则适用于简单场景或对响应速度要求更高的场景。


![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/42e74b3c161e4478aef36021308e26f8.gif)

### 优化八、四角控制点随意拖拽放大长和宽【摒弃等比放大缩小】
![canvas实现图片标注之Fabric.js从入门学习到实现labelImg矩形多边形标注工具](https://i-blog.csdnimg.cn/direct/284347355c224a1b952c2fbcf53eab71.gif)

```typescript

// 创建矩形控制点
function createCustomControls() {
  const commonOpts = {
    cursorStyle: "pointer", // 鼠标样式
    withConnection: false, // 是否连接
    render: renderSolidGreenCircle, // 绘制圆形
    cornerSize: 10, // 控制点大小
  };

  return {
    // 左上角 
    tl: new Control({
      ...commonOpts,
      x: -0.5,
      y: -0.5,
      cursorStyle: "nw-resize",
      actionHandler: controlsUtils.scalingEqually,
    }),
    // 右上角
    tr: new Control({
      ...commonOpts,
      x: 0.5,
      y: -0.5,
      cursorStyle: "ne-resize",
      actionHandler: controlsUtils.scalingEqually,
    }),
    // 左下角 
    bl: new Control({
      ...commonOpts,
      x: -0.5,
      y: 0.5,
      cursorStyle: "sw-resize",
      actionHandler: controlsUtils.scalingEqually,
    }),
    // 右下角 
    br: new Control({
      ...commonOpts,
      x: 0.5,
      y: 0.5,
      cursorStyle: "se-resize",
      actionHandler: controlsUtils.scalingEqually,
    }),

    // // 左边中点 - 横向缩放
    // ml: new Control({
    //   ...commonOpts,
    //   x: -0.5,
    //   y: 0,

    //   cursorStyle: "w-resize",
    //   actionHandler: controlsUtils.scalingX,
    // }),
    // // 右边中点 - 横向缩放
    // mr: new Control({
    //   ...commonOpts,
    //   x: 0.5,
    //   y: 0,
    //   cursorStyle: "e-resize",
    //   actionHandler: controlsUtils.scalingX,
    // }),
    // // 上边中点 - 纵向缩放
    // mt: new Control({
    //   ...commonOpts,
    //   x: 0,
    //   y: -0.5,
    //   cursorStyle: "n-resize",
    //   actionHandler: controlsUtils.scalingY,
    // }),
    // // 下边中点 - 纵向缩放
    // mb: new Control({
    //   ...commonOpts,
    //   x: 0,
    //   y: 0.5,
    //   cursorStyle: "s-resize",
    //   actionHandler: controlsUtils.scalingY,
    // }),

    // 旋转控制点，暂时不需要旋转需求
    // mtr: new Control({
    //   ...commonOpts,
    //   x: 0,
    //   y: -0.7,
    //   cursorStyle: "crosshair",
    //   actionHandler: controlsUtils.rotationWithSnapping,
    //   offsetY: -10, // 合理调整旋转点距离顶部的距离
    // }),
  };
}
```

优化中~
## END
