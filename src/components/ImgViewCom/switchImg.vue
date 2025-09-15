<template>
  <div class="content-box" style="position: relative">
    <el-dialog
      @close="handleClose"
      v-model="dialogVisible"
      fullscreen
      top="40vh"
      draggable
    >
      <SvgIcon
        name="ele-Close"
        class="close-icon"
        @click="handleClose"
      ></SvgIcon>
      <div
        ref="canvasBox"
        class="canvas-container"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        style="position: relative"
      >
        <canvas
          ref="myCanvas"
          style="
            position: absolute;
            z-index: 99 !important;
            width: 10000px;
            height: 10000px;
          "
        ></canvas>
        <canvas
          ref="rectCanvas"
          style="position: absolute; z-index: 1000 !important"
        ></canvas>
      </div>
      <el-icon v-if="source=='log'" class="left-icon" :size="28" color="#fff" 
        :style="{opacity:currentImgUrl==1?0:1}" @click="handleImg('prev')">
        <ele-ArrowLeftBold />
      </el-icon>
      <el-icon v-if="source=='log'" class="right-icon" :size="28" color="#fff"
        :style="{opacity:currentImgUrl==3?0:1}" @click="handleImg('next')">
        <ele-ArrowRightBold />
      </el-icon>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, watch, reactive } from "vue";
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth";
import _ from "lodash";
const authStore = useAuthStore();
// 定义 defectCoordinates 的类型
interface DefectCoordinate {
  bbox: [number, number, number, number]; // 确保 bbox 是一个包含四个数字的数组
  classID: number; // 标注类别 ID
  confidence: number; // 置信度
  xcID?: number;
}
// 定义 Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  defectCoordinates: {
    type: Array as () => DefectCoordinate[],
    default: () => [],
  },
  source: {
    type: String,
    detault: 'history'
  },
  currentImgUrl: {
    type: String,
    default: '1'
  
  }
});
// 定义 Emits
const emit = defineEmits(["update:visible",'switchImg']);
const canvasBox = ref();
let clientX = 0; // 记录当前鼠标双击的X值
let clientY = 0; // 记录当前鼠标双击的Y值
let editingIndex: number | null = null; // 当前正在编辑的标注索引
const dialogVisible: any = ref(false); // 是否打开图片预览窗口
const myCanvas = ref<HTMLCanvasElement | null>(null);
const rectCanvas = ref<HTMLCanvasElement | null>(null);
const rightClickedIndex = ref<number | null>(null); // 右键点击标注的索引

// 新增状态变量
const selectedBoxIndex = ref<number | null>(null); // 当前选中的标注框索引
const isDraggingBox = ref(false); // 是否正在拖拽标注框
const isResizingBox = ref(false); // 是否正在调整标注框大小
const resizeHandle = ref<
  "top-left" | "top-right" | "bottom-left" | "bottom-right" | null
>(null); // 当前调整的角点

// 图片状态
let imgState: any = reactive({
  img: new Image(),
  scale: 0.245, // 缩放比例
  x: 0, // 图片左上角的 x 坐标
  y: 0, // 图片左上角的 y 坐标
  rectangles: [] as {
    x1: number; // 左上角 x
    y1: number; // 左上角 y
    x2: number; // 右下角 x
    y2: number; // 右下角 y
    label: string; // 标注文字
  }[], // 存储矩形框数据
});

let isDragging = false;
let startX = 0;
let startY = 0;
let startScrollLeft = 0;
let startScrollTop = 0;

// 判断鼠标点击位置是否在某个标注框内
const findClickedBox = (mouseX: number, mouseY: number) => {
  if(!props.defectCoordinates) return 
  for (let i = 0; i < props.defectCoordinates.length; i++) {
    const item = props.defectCoordinates[i];
    const [x1, y1, x2, y2] = item.bbox;

    // 计算标注框的边界
    const rectX = Math.min(x1, x2) * imgState.scale;
    const rectY = Math.min(y1, y2) * imgState.scale;
    const rectWidth = Math.abs(x2 - x1) * imgState.scale;
    const rectHeight = Math.abs(y2 - y1) * imgState.scale;

    // 判断是否点击了标注框的中心区域
    if (
      mouseX >= rectX &&
      mouseX <= rectX + rectWidth &&
      mouseY >= rectY &&
      mouseY <= rectY + rectHeight
    ) {
      return { index: i, handle: null }; // 返回标注框索引及操作类型
    }

    // 判断是否点击了标注框的角点
    const handles = [
      { type: "top-left", x: rectX, y: rectY },
      { type: "top-right", x: rectX + rectWidth, y: rectY },
      { type: "bottom-left", x: rectX, y: rectY + rectHeight },
      { type: "bottom-right", x: rectX + rectWidth, y: rectY + rectHeight },
    ];

    for (const handle of handles) {
      if (
        mouseX >= handle.x - 5 &&
        mouseX <= handle.x + 5 &&
        mouseY >= handle.y - 5 &&
        mouseY <= handle.y + 5
      ) {
        return { index: i, handle: handle.type as typeof resizeHandle.value };
      }
    }
  }

  return null; // 没有找到匹配的标注框
};

// 加载图片到 Canvas
const loadImageToCanvas = () => {
  const canvas: any = myCanvas.value;
  const dirtyCanvas: any = rectCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dirtyCtx = dirtyCanvas.getContext("2d");
  ctx.imageSmoothingEnabled = false; // 禁用平滑处理.
  ctx.imageSmoothingQuality = "high"; // 使用高质量的缩放算法
  dirtyCtx.imageSmoothingEnabled = false;
  dirtyCtx.imageSmoothingQuality = "high";

  // 设置 Canvas 尺寸 2736 x 3648
  canvas.width = 10000;
  canvas.height = 10000;
  // 加载图片
  // imgState.img.src = props.imageSrc;  http://localhost:8888/
  imgState.img.src = props.imageSrc;

  imgState.img.onload = () => {
    imgState.x = (canvas.width - imgState.img.width * imgState.scale) / 5;
    imgState.y = (canvas.height - imgState.img.height * imgState.scale) / 5;

    imgState.x = imgState.img.width;
    imgState.y = imgState.img.height;

    // 脏图片的canvas
    // dirtyCtx.width = imgState.img.width;
    // dirtyCtx.height = imgState.img.height;
    drawImage(ctx, true);
  };

  imgState.img.onerror = (err: any) => {
    console.error("图片加载失败:", err);
  };
};

// 前一张图片
const handleImg = (status:string) => {
  emit('switchImg',status)
};


// 右键点击时触发的函数
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault(); // 阻止默认菜单弹出
  clientX = e.clientX; // 相对于窗口的 X 坐标
  clientY = e.clientY; // 相对于窗口的 Y 坐标

  const canvas: any = myCanvas.value;
  if (!canvas) return;

  // const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  // 获取鼠标点击位置相对于 Canvas 的坐标
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // 查找被右键点击的标注文字
  const clickedLabel = findClickedLabel(mouseX, mouseY);
  // console.log("被右键点击的标注文字:", clickedLabel);
  if (clickedLabel) {
    // 如果找到对应的标注文字，记录其索引
    rightClickedIndex.value = clickedLabel.index;
    // 创建删除按钮
    createDeleteButton(e.clientX, e.clientY);
  }
};

// 创建删除按钮
const createDeleteButton = (x: number, y: number) => {
  // 获修改下拉框取元素
  let dvSelect = document.getElementById("DBSELECT");
  // 检查元素是否存在并删除
  if (dvSelect) {
    dvSelect.remove();
  }
  const canvas: any = myCanvas.value;
  const ctx = canvas.getContext("2d");
  // 移除已有的删除按钮
  let existingButton = document.getElementById("DELETEBUTTON");
  if (existingButton) existingButton.remove();

  // 创建新的删除按钮
  const button = document.createElement("button");
  // button.id = "deleteButton";
  button.id = "DELETEBUTTON";
  button.innerText = "删除";
  button.style.zIndex = "9999";
  button.style.width = "60px";
  button.style.position = "absolute";
  button.style.left = `${clientX}px`;
  button.style.top = `${clientY + 5}px`;
  // console.log("我被执行了", clientX, clientY);
  // 监听删除按钮的点击事件
  button.addEventListener("click", () => {
    if (rightClickedIndex.value !== null) {
      // 删除对应索引的标注信息
      props.defectCoordinates.splice(rightClickedIndex.value, 1);
      rightClickedIndex.value = null;

      // 重新绘制画布
      drawImage(ctx!);

      // 移除删除按钮
      button.remove();
    }
  });

  // 将删除按钮添加到 DOM 中
  document.body.appendChild(button);
};

// 根据Id查找瑕疵信息
function findBlemishNameBySort(classIdValue: string) {
  const foundItem = authStore.defectList.find(
    (item: any) => item.classId === classIdValue
  );
  return foundItem ? foundItem : null;
}
// 绘制图片
const drawImage = (ctx: CanvasRenderingContext2D, isDirty?: boolean) => {
  const dirtyCanvas: any = rectCanvas.value;
  const dirtyCtx = dirtyCanvas.getContext("2d");
  const { img, scale, x, y, rectangles } = imgState;
  // console.log("scale", scale);
  // 如果是拉框框或者移动矩形框则不绘制图片
  if (isDirty) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 清空画布
    ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
  }
  // 清空脏画布，并且设置脏画布的宽高
  dirtyCtx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 清空脏画布
  dirtyCtx.canvas.width = img.width * scale;
  dirtyCtx.canvas.height = img.height * scale;
  for (let i = 0; i < props.defectCoordinates.length; i++) {
    props.defectCoordinates[i].xcID = i;
    // 根据ID获取瑕疵信息
    const tempXcInfo = findBlemishNameBySort(
      String(props.defectCoordinates[i].classID)
    );
    // 获取当前元素
    const item = props.defectCoordinates[i];

    // 从bbox数组中提取坐标
    const [x1, y1, x2, y2] = item.bbox;

    // 计算矩形的信息
    const rectX = Math.min(x1, x2);
    const rectY = Math.min(y1, y2);
    const rectWidth = Math.abs(x2 - x1);
    const rectHeight = Math.abs(y2 - y1);
    // 设置绘图样式
    dirtyCtx.strokeStyle = `rgb(${tempXcInfo.blemishRGBColor})`;
    dirtyCtx.lineWidth = 1;

    // 绘制矩形
    dirtyCtx.strokeRect(
      rectX * scale,
      rectY * scale,
      rectWidth * scale,
      rectHeight * scale
    );
    // 计算文字位置并考虑缩放比例
    const textX = (Math.min(x1, x2) + Math.abs(x2 - x1) / 2) * imgState.scale;
    const textY = Math.min(y1, y2) * imgState.scale;
    // 根据缩放比例调整文字大小
    const fontSize = 20; // 假设原始字体大小为 14px
    dirtyCtx.font = `${fontSize}px Arial`;
    if (tempXcInfo) {
      // 绘制标注文字
      dirtyCtx.fillStyle = `rgb(${tempXcInfo.blemishRGBColor})`; // 文字颜色
      dirtyCtx.textAlign = "center"; // 文字水平居中
      dirtyCtx.textBaseline = "bottom"; // 文字垂直对齐方式
      dirtyCtx.fillText(tempXcInfo.blemishName, textX, textY); // 文字位置
    }
  }
};
// 鼠标按下时
const handleMouseDown = (e: MouseEvent) => {
  const container = canvasBox.value as HTMLElement;

  const canvas: any = myCanvas.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const clickedBox = findClickedBox(mouseX, mouseY);
  if (clickedBox) {
    selectedBoxIndex.value = clickedBox.index;
    if (clickedBox.handle) {
      // 进入调整大小模式
      isResizingBox.value = true;
      // 关闭角色拖拽
      isDraggingBox.value = false;
      // 关闭画布拖拽
      isDragging = false;
      // 记录往那个方向缩放
      resizeHandle.value = clickedBox.handle;
      // console.log("被点击的标注信息:", clickedBox);
      // console.log("clickedBox.handle", clickedBox.handle);
    } else {
      // 如果点击了中心区域，则进入拖拽移动模式
      isDraggingBox.value = true;
      isDragging = false;
      isResizingBox.value = false;
      resizeHandle.value = null;
    }
  } else {
    // console.log("没有点击到角色");
    isDraggingBox.value = false;
    selectedBoxIndex.value = null;
    resizeHandle.value = null;
    isDragging = true;
  }
  // 记录初始值
  startX = e.pageX;
  startY = e.pageY;
  startScrollLeft = container.scrollLeft;
  startScrollTop = container.scrollTop;
  // 更改鼠标样式
  container.style.cursor = "grabbing";
};
// 鼠标移动时
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging && !isDraggingBox.value && !isResizingBox.value) return;
  const container = canvasBox.value as HTMLElement;
  // console.log("selectedBoxIndex.value", selectedBoxIndex.value);
  if (selectedBoxIndex.value) {
    const canvas: any = myCanvas.value;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const item = props.defectCoordinates[selectedBoxIndex.value];
    const [x1, y1, x2, y2] = item.bbox;
    // console.log("isDraggingBox.value", isResizingBox.value);
    // console.log(isResizingBox.value && resizeHandle.value);
    if (isDraggingBox.value) {
      // 拖拽移动标注框
      const deltaX = mouseX / imgState.scale - x1;
      const deltaY = mouseY / imgState.scale - y1;

      props.defectCoordinates[selectedBoxIndex.value].bbox = [
        x1 + deltaX - (x2 - x1),
        y1 + deltaY - (y2 - y1),
        x2 + deltaX - (x2 - x1),
        y2 + deltaY - (y2 - y1),
      ];
    } else if (isResizingBox.value && resizeHandle.value) {
      // console.log("移动框框大小");
      // 调整标注框大小
      switch (resizeHandle.value) {
        case "top-left":
          props.defectCoordinates[selectedBoxIndex.value].bbox = [
            mouseX / imgState.scale,
            mouseY / imgState.scale,
            x2,
            y2,
          ];
          break;
        case "top-right":
          props.defectCoordinates[selectedBoxIndex.value].bbox = [
            x1,
            mouseY / imgState.scale,
            mouseX / imgState.scale,
            y2,
          ];
          break;
        case "bottom-left":
          props.defectCoordinates[selectedBoxIndex.value].bbox = [
            mouseX / imgState.scale,
            y1,
            x2,
            mouseY / imgState.scale,
          ];
          break;
        case "bottom-right":
          props.defectCoordinates[selectedBoxIndex.value].bbox = [
            x1,
            y1,
            mouseX / imgState.scale,
            mouseY / imgState.scale,
          ];
          break;
      }
    }
    drawImage(canvas.getContext("2d"), false);
    // _.throttle(() => drawImage(canvas.getContext("2d")), 5);
    // 重新绘制画布
  } else {
    // 计算鼠标移动的距离
    const deltaX = e.pageX - startX;
    const deltaY = e.pageY - startY;

    // 更新滚动位置
    container.scrollLeft = startScrollLeft - deltaX;
    container.scrollTop = startScrollTop - deltaY;
  }
};
// 鼠标释放时
const handleMouseUp = () => {
  isDragging = false;
  const container = canvasBox.value as HTMLElement;
  isDraggingBox.value = false;
  isResizingBox.value = false;
  resizeHandle.value = null;
  selectedBoxIndex.value = null;
  // 恢复鼠标样式
  container.style.cursor = "grab";
};
// 处理滚轮缩放
const handleWheel = (event: WheelEvent) => {
  // console.log("滚动缩放:");/
  // 获修改下拉框取元素
  let dvSelect = document.getElementById("DBSELECT");
  // 检查元素是否存在并删除
  if (dvSelect) {
    dvSelect.remove();
  }
  // 获取删除按钮的元素，如果存在就删除
  let deleteButton = document.getElementById("DELETEBUTTON");
  if (deleteButton) {
    deleteButton.remove();
  }

  event.preventDefault();
  const canvas: any = myCanvas.value;
  if (!canvas) return;
  const rect: any = canvas.getBoundingClientRect();
  const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9; // 放大或缩小因子

  // 计算鼠标相对于canvas左上角的位置
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // 更新缩放比例
  imgState.scale *= zoomFactor;

  // 根据鼠标位置调整图片位置
  imgState.x += (mouseX - imgState.x) * (1 - zoomFactor);
  imgState.y += (mouseY - imgState.y) * (1 - zoomFactor);

  // 边界限制
  const scaledWidth = imgState.img.width * imgState.scale;
  const scaledHeight = imgState.img.height * imgState.scale;
  imgState.x = Math.min(Math.max(imgState.x, 0), canvas.width - scaledWidth);
  imgState.y = Math.min(Math.max(imgState.y, 0), canvas.height - scaledHeight);
  drawImage(canvas.getContext("2d"), true);
};
// 清空画布
const clearCanvas = () => {
  const canvas: any = myCanvas.value;
  if (!canvas) return;
  imgState = {
    img: new Image(),
    scale: 0.245, // 缩放比例
    x: 0, // 图片左上角的 x 坐标
    y: 0, // 图片左上角的 y 坐标
    rectangles: [] as {
      x1: number; // 左上角 x
      y1: number; // 左上角 y
      x2: number; // 右下角 x
      y2: number; // 右下角 y
      label: string; // 标注文字
    }[], // 存储矩形框数据
  };
  isDragging = false;
  startX = 0;
  startY = 0;
  startScrollLeft = 0;
  startScrollTop = 0;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布内容
  const container = canvasBox.value as HTMLElement;
  // 更新滚动位置
  container.scrollLeft = 0;
  container.scrollTop = 0;
};
// 双击唤醒输入框
const handleDblClick = (e: MouseEvent) => {
  // 获取删除按钮的元素，如果存在就删除
  let deleteButton = document.getElementById("DELETEBUTTON");
  if (deleteButton) {
    deleteButton.remove();
  }
  clientX = e.clientX; // 相对于窗口的 X 坐标
  clientY = e.clientY; // 相对于窗口的 Y 坐标
  const canvas: any = myCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  // 获取鼠标点击位置相对于 Canvas 的坐标
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // 查找被双击的标注文字
  const clickedLabel = findClickedLabel(mouseX, mouseY);

  if (clickedLabel) {
    // 如果找到对应的标注文字，进入编辑模式
    enterEditMode(clickedLabel);
  }
};
const findClickedLabel = (mouseX: number, mouseY: number) => {
  for (let i = 0; i < props.defectCoordinates.length; i++) {
    const item = props.defectCoordinates[i];
    const [x1, y1, x2, y2] = item.bbox;

    // 计算文字位置
    const textX = (Math.min(x1, x2) + Math.abs(x2 - x1) / 2) * imgState.scale;
    const textY = Math.min(y1, y2) * imgState.scale;

    // 假设文字宽度为 100px，高度为 20px（根据实际字体大小调整）
    const textWidth = 100;
    const textHeight = 20;

    // 判断鼠标位置是否在文字范围内
    if (
      mouseX >= textX - textWidth / 2 &&
      mouseX <= textX + textWidth / 2 &&
      mouseY >= textY - textHeight &&
      mouseY <= textY
    ) {
      return { index: i, item }; // 返回被点击的标注信息及其索引
    }
  }
  return null; // 没有找到匹配的标注文字
};
// 输入框的定位
const enterEditMode = (clickedLabel: {
  index: number;
  item: DefectCoordinate;
}) => {
  editingIndex = clickedLabel.index;
  // 创建一个下拉选择框
  const select = document.createElement("select");
  select.id = "DBSELECT";
  select.style.position = "absolute";
  select.style.left = `${clientX}px`;
  select.style.top = `${clientY}px`;
  // 设置下拉框的样式
  select.style.width = "150px"; // 根据实际需求调整宽度
  select.style.height = "30px"; // 根据实际需求调整高度
  select.style.background = "#FFF";
  select.style.zIndex = "999999";

  // 动态生成下拉选项
  authStore.defectList.forEach((defect: any) => {
    const option = document.createElement("option");
    option.value = defect.classId; // 使用 classId 作为选项值
    option.textContent = defect.blemishName; // 显示瑕疵名称
    select.appendChild(option);
  });

  // 设置默认选中项
  const currentClassId = String(clickedLabel.item.classID);
  select.value = currentClassId;

  // 添加到 DOM 中
  document.body.appendChild(select);

  // 聚焦下拉框
  select.focus();

  // 监听下拉框的改变事件
  const handleChange = () => {
    // 更新标注的 classID
    const newClassId = select.value;
    updateLabelClassId(editingIndex!, newClassId);

    // 移除下拉框
    select.remove();
    editingIndex = null;
  };

  select.addEventListener("change", handleChange);
  select.addEventListener("blur", handleChange); // 失去焦点时也触发更新
};
const updateLabelClassId = (index: number, newClassId: string) => {
  // 更新缺陷坐标的 classID
  props.defectCoordinates[index].classID = Number(newClassId);

  // 重新绘制画布
  // drawImage(myCanvas.value!.getContext("2d"));
  const canvasContext = myCanvas.value?.getContext("2d");
  if (canvasContext) {
    drawImage(canvasContext);
  } else {
    console.error("无法获取 Canvas 的 2D 上下文");
  }
};
// 监听父组件传递的 visible 状态变化
watch(
  () => props.visible,
  async (newVal) => {
    dialogVisible.value = newVal;
    if (props.visible) {
      // await nextTick();
      // loadImageToCanvas();

      // 添加滚轮事件监听器
      if (rectCanvas.value && rectCanvas.value instanceof HTMLCanvasElement) {
        rectCanvas.value.addEventListener("wheel", handleWheel);
        rectCanvas.value.addEventListener("mousedown", handleMouseDown);
        rectCanvas.value.addEventListener("mousemove", handleMouseMove);
        rectCanvas.value.addEventListener("mouseup", handleMouseUp);
        rectCanvas.value.addEventListener("mouseleave", handleMouseUp);
        rectCanvas.value.addEventListener("dblclick", handleDblClick); // 添加双击事件
        rectCanvas.value?.addEventListener("contextmenu", handleContextMenu);
      }
    } else {
      // 弹窗关闭时，移除事件监听器但不销毁画布
      if (rectCanvas.value && rectCanvas.value instanceof HTMLCanvasElement) {
        rectCanvas.value.removeEventListener("wheel", handleWheel);
        rectCanvas.value.removeEventListener("mousedown", handleMouseDown);
        rectCanvas.value.removeEventListener("mousemove", handleMouseMove);
        rectCanvas.value.removeEventListener("mouseup", handleMouseUp);
        rectCanvas.value.removeEventListener("mouseleave", handleMouseUp);
        rectCanvas.value.removeEventListener("dblclick", handleDblClick); // 移除双击事件

        // 弹窗关闭的时候，销毁canvas操作中产生的DOM元素
        // 获修改下拉框取元素
        let dvSelect = document.getElementById("DBSELECT");
        // 检查元素是否存在并删除
        if (dvSelect) {
          dvSelect.remove();
        }
        // 获取删除按钮的元素，如果存在就删除
        let deleteButton = document.getElementById("DELETEBUTTON");
        if (deleteButton) {
          deleteButton.remove();
        }
      }
    }
  }
);
watch(()=>props.imageSrc, async (newVal) => {
  // async (newVal) => {
    await nextTick();
    loadImageToCanvas();
  // }
})
const handleClose = () => {
  dialogVisible.value = false;
  // 清空画布，初始化画布数据
  clearCanvas();
};
// 当弹窗关闭时，通知父组件更新状态
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    emit("update:visible", false);
  }
});
</script>

<script lang='ts'>
export default {
  name: "ImgViewCom",
};
</script>
<style lang="scss" scoped>
.content-box {
  width: 100%;
  height: 100%;
  background: white;
}
.canvas-container {
  width: 100%; /* 容器宽度 */
  height: calc(100vh); /* 容器高度 */
  overflow: auto; /* 显示滚动条 */
  // border: 1px solid #ccc; /* 边框样式 */
  padding-left: 30%;
  cursor: grab; /* 默认鼠标样式 */
  // background: rgba(19, 19, 19, 0.7);
  overflow-x: hidden;
  overflow-y: hidden;
  margin-top: 10px;
}
canvas {
  display: block; /* 避免默认的 inline-block 导致的布局问题 */
}
::v-deep .el-dialog.is-fullscreen {
  background: rgba(19, 19, 19, 0.7);
}
::v-deep .el-dialog {
  padding: 0 !important;
}
::v-deep .el-dialog__header {
  display: none;
}

.close-icon {
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
  color: #fff;
  font-size: 40px !important;
  z-index: 999999;
}
.close-icon:hover {
  color: #165dff !important;
}
.left-icon{
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  z-index: 99;
}
.right-icon{
  position: absolute;
  right: 20px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  z-index: 99;
}
</style>
