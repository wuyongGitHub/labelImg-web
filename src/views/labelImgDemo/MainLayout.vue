<template>
  <div class="labelImg">
    <!-- 左边菜单栏 -->
    <div class="left-menu">
      <!-- @click="showCross" -->
      <div class="menu-item" style="text-align: center">
        <el-switch
          style="margin-left: -15px"
          v-model="isShowCrosshairImpont"
          active-color="#9AC8E0"
          inactive-color="#E8E8E8"
        />
        <div class="menu-item-text">“+”辅助线</div>
      </div>
      <div class="menu-item" style="text-align: center">
        <el-switch
          style="margin-left: -15px"
          v-model="regularPolygon"
          active-color="#9AC8E0"
          inactive-color="#E8E8E8"
        />
        <div class="menu-item-text">是否规则多边形</div>
      </div>

      <div class="menu-item">
        <div class="menu-item-icon1"></div>
        <div class="menu-item-text">保存</div>
      </div>

      <div class="menu-item" @click="nextImage">
        <div class="menu-item-icon2"></div>
        <div class="menu-item-text">下一张</div>
      </div>

      <div class="menu-item" @click="prevImage">
        <div class="menu-item-icon3"></div>
        <div class="menu-item-text">上一张</div>
      </div>
      <div class="menu-item" @click="createRectangles">
        <div class="menu-item-icon4"></div>
        <div class="menu-item-text">创建矩形框选</div>
      </div>

      <div class="menu-item" @click="createPolygon">
        <div class="menu-item-icon9"></div>
        <div class="menu-item-text">
          {{ drawingPolygon ? "取消创建多边形" : "创建多边形" }}
        </div>
      </div>

      <div class="menu-item" @click="zoomIn">
        <div class="menu-item-icon5"></div>
        <div class="menu-item-text">放大+4</div>
      </div>
      <div class="menu-item" @click="zoomOut">
        <div class="menu-item-icon6"></div>
        <div class="menu-item-text">缩小-4</div>
      </div>
      <div class="menu-item" @click="resetZoom">
        <div class="menu-item-icon7"></div>
        <div class="menu-item-text">还原缩放</div>
      </div>
      <div class="menu-item" @click="copyAnnotation">
        <div class="menu-item-icon10"></div>
        <div class="menu-item-text">复制</div>
      </div>
      <div class="menu-item" @click="pasteAnnotation">
        <div class="menu-item-icon11"></div>
        <div class="menu-item-text">粘贴</div>
      </div>
      <div class="menu-item" @click="exportData">
        <div class="menu-item-icon8"></div>
        <div class="menu-item-text">导出数据</div>
      </div>

      <!--
      <div><h4>使用说明：</h4></div>
      <div>1. 按住"w"即可拖拽创建矩形</div>
      <div>2. ctrl+鼠标滚轮根据鼠标位置放大缩小图片</div>
      <div>3. 双击编辑</div>
      <div>4. 左上label列表可删除编辑</div>
      <div>5. 双击多边形进入编辑反之移动</div>-->
    </div>
    <!-- 画布区域 -->
    <div class="canvas-box">
      <canvas id="imageView" class="imageView" ref="canvas"></canvas>
    </div>
    <div
      style="
        height: 20px;
        width: 100%;
        background: #f0f0f0;
        border-top: 1px solid #333;
        position: fixed;
        left: 122px;
        right: 230px;
        bottom: 0;
        margin-left: 20px;
      "
    >
      缩放:【{{ toPercent(scaleCoutent) }}】 当前鼠标相对于图片位置【X:{{
        currentMousePositionX
      }}
      | Y:{{ currentMousePositionY }}】
    </div>
    <!-- 右边右侧标签和文件列表    -->
    <div class="right-list" v-if="imageLabelData.length > 0">
      <div class="right-label-list">
        Box Labels【{{
          imageLabelData[currentIndex].labelInfo.length +
          imageLabelData[currentIndex].labelPolygonInfo.length
        }}】
        <!-- | 多边形【{{ imageLabelData[currentIndex].labelInfo.length }}】 |
        矩形【{{ imageLabelData[currentIndex].labelPolygonInfo.length }}】 -->
      </div>
      <div class="right-label-list-content">
        <div
          :class="
            item.id === selectedLabelId
              ? 'label-item label-item-active'
              : 'label-item'
          "
          style="border-bottom: 1px solid #ebebeb"
          v-for="item in imageLabelData[currentIndex].labelInfo"
          :key="item.id"
          :style="{ backgroundColor: stringToColour(item.labelText, false) }"
          @click="labelClick(item)"
        >
          {{ item.labelText }}
          <el-button
            class="delete-btn"
            type="danger"
            style="width: 40px; height: 100%; background: red; float: right"
            @click="removeBox(item.id)"
            >删除</el-button
          >
          <el-button
            class="delete-btn"
            type="primary"
            style="
              width: 40px;
              height: 100%;
              margin-right: 2px;
              background: #409eff;
              float: right;
            "
            @click="startEditLabel(item.id, 'rect')"
            >修改</el-button
          >
          <el-button
            class="delete-btn"
            type="primary"
            style="
              width: 40px;
              height: 100%;
              margin-right: 2px;
              background: #409eff;
              float: right;
              position: relative;
              left: 10px;
            "
            @click="exportDefect(item.id)"
            >导出</el-button
          >
        </div>
        <div
          :class="
            item.id === selectedLabelId
              ? 'label-item label-item-active'
              : 'label-item'
          "
          style="border-bottom: 1px solid #ebebeb"
          v-for="item in imageLabelData[currentIndex].labelPolygonInfo"
          :key="item.id"
          @click="labelClick(item)"
          :style="{ backgroundColor: stringToColour(item.labelText, false) }"
        >
          {{ item.labelText }}
          <el-button
            class="delete-btn"
            type="danger"
            style="width: 40px; height: 100%; background: red; float: right"
            @click="removePolygon(item.id)"
            >删除</el-button
          >
          <el-button
            class="delete-btn"
            type="primary"
            style="
              width: 40px;
              height: 100%;
              margin-right: 2px;
              background: #409eff;
              float: right;
            "
            @click="startEditLabel(item.id, 'polygon')"
            >修改</el-button
          >
          <el-button
            class="delete-btn"
            type="info"
            style="
              width: 40px;
              height: 100%;
              margin-right: 2px;
              background: #409eff;
              float: right;
              position: relative;
              left: 10px;
            "
            @click="exportDefect(item.id)"
            >导出</el-button
          >
        </div>
      </div>

      <div class="right-file-list">
        File List
        <span style="margin-left: 10px"
          >[{{ currentIndex + 1 }}/{{ imageLabelData.length }}]</span
        >
      </div>
      <div class="right-file-list-content">
        <div class="img-List-item">
          <div
            style="
              cursor: pointer;
              margin-bottom: 3px;
              border-bottom: 1px solid #333;
            "
            v-for="(item, index) in imageLabelData"
            :key="index"
            :class="index === currentIndex ? 'label-item-active' : ''"
            @click="changeImg(index)"
          >
            {{ getFilenameFromUrl(item.imgurl) }}
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改标签"
      v-model="editingLabel"
      width="300px"
      :close-on-click-modal="false"
    >
      <div style="display: flex; flex-direction: column; gap: 10px">
        <!-- <el-input v-model="editLabelText" placeholder="请输入标签名" /> -->
        <el-select v-model="editLabelText" placeholder="选择历史瑕疵标签">
          <el-option
            v-for="item in defectOptions1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editingLabel = null">取消</el-button>
          <el-button type="primary" @click="confirmEditLabel">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="labelImg">
import { nextTick, onMounted, ref, reactive, watch } from "vue";
import CryptoJS from "crypto-js";

import { ElMessage } from "element-plus";
import {
  Canvas,
  Line,
  Group,
  FabricImage,
  controlsUtils,
  Rect,
  Point,
  Textbox,
  Control,
  util,
  Circle,
  Text,
  Polygon,
  StaticCanvas,
} from "fabric";

interface LabelInfo {
  id: string;
  pos1: [number, number];
  pos2: [number, number];
  labelText: string;
  imgUrl: string;
  labelStyle: { color: string; background: string };
  fabricGroup?: Group;
}
const currentMousePositionX = ref(0);
const currentMousePositionY = ref(0);
const scaleCoutent = ref(1);
let imgScale = 1; // 记录缩放倍数
const currentIndex = ref(0); // 当前显示哪张图
const selectedLabelId = ref<string | null>(null); // 当前是哪个瑕疵
//  用于记录当前编辑的标签 ID
const editingLabelId = ref<string | null>(null);
const editingLabel = ref(false); // 当前编辑的标签信息
const defectOptions1 = [
  { label: "鸟窝", value: "1" },
  { label: "塑料垃圾", value: "2" },
  { label: "绝缘子", value: "3" },
  // { label: "崩边", value: "3" },
  // { label: "裂纹", value: "4" },
  // { label: "字符缺陷", value: "5" },
  // { label: "白点", value: "6" },
]; // 示例历史瑕疵选项
const editLabelText = ref(""); // 编辑中的文字

// 记录当前点击修改的是多边形还是矩形
const labelType = ref("rect");
// 数据源
let labelData: any = reactive({
  imgurl: "",
  labelInfo: [] as LabelInfo[],
});
// 数据源2
let imageLabelData: any = reactive([
  // {
  //   imgurl: "http://192.168.80.32:8888/286_Coax_67480501_SourceImg.jpg",
  //   labelInfo: [] as LabelInfo[],
  //   labelPolygonInfo: [
  //     {
  //       labelText: "cs1",
  //       id: "box_1755159767291",
  //       circlePoints: [
  //         { x: 8649.583333333334, y: 1501.333333333333 },
  //         { x: 7945.833333333334, y: 3961.107142857143 },
  //         { x: 9561.107142857143, y: 2493.285714285714 },
  //         { x: 7831.892857142858, y: 1883.3690476190475 },
  //         { x: 8683.095238095239, y: 3833.761904761905 },
  //       ],
  //     },
  //     {
  //       labelText: "cs111",
  //       id: "box_1755159917901",
  //       circlePoints: [
  //         { x: 13341.28524918608, y: 1821.6477228006165 },
  //         { x: 12782.333869986767, y: 3689.854584809132 },
  //         { x: 14272.870881184937, y: 3060.404833458553 },
  //         { x: 12253.596078852279, y: 2058.320829308434 },
  //         { x: 14000.948588601483, y: 4550.941844656722 },
  //       ],
  //     },
  //     {
  //       labelText: "cs11",
  //       id: "box_1755160282428",
  //       circlePoints: [
  //         { x: 3580.186388680191, y: 2033.2385156166151 },
  //         { x: 3011.1638134592686, y: 3090.7140978855855 },
  //         { x: 4839.085891381347, y: 2909.43256949662 },
  //         { x: 4229.778532073987, y: 1862.0281832492583 },
  //       ],
  //     },
  //   ] as any,
  // },
  // {
  //   imgurl: "http://192.168.80.32:8888/286_Coax_67480501_SourceImg.jpg",
  //   labelInfo: [
  //     {
  //       labelText: "猫",
  //       pos1: [0, 0],
  //       pos2: [500, 500],
  //       id: "box-1",
  //     },
  //   ] as LabelInfo[],
  //   labelPolygonInfo: [],
  // },
  // {
  //   // http://192.168.80.32:8888/286_Coax_67480501_SourceImg.jpg
  //   imgurl: "",
  //   labelInfo: [] as LabelInfo[],
  //   labelPolygonInfo: [],
  // },
]);
// 更新数据的方式应该是修改现有对象的属性，而不是重新赋值整个对象
labelData.imgurl = "http://192.168.80.32:8888/286_Coax_67480501_SourceImg.jpg";
labelData.labelInfo.push(
  {
    labelText: "猫",
    pos1: [0, 0],
    pos2: [500, 500],
    id: "box-1",
  },
  {
    labelText: "狗",
    pos1: [0, 0],
    pos2: [250, 250],
    id: "box-2",
  }
);
const crossCanvasDom = ref(null);
const canvas = ref<HTMLCanvasElement | null>(null); // 画布元素
let fCanvas: Canvas; // 画布实例
const isDragging = false; // 标记是否正在拖拽
// 记录第一次缩放的值
let drawing = false; // 绘制状态
let editing = false; // 标记是否正在编辑
let isPanning = false; // 标记是否正在平移
let startX = 0;
let startY = 0; // 鼠标按下时的坐标
let lastX = 0; // 上一次鼠标X位置
let lastY = 0; // 上一次鼠标y位置
let tempRect: Rect | null = null;
let startPos: any = { x: 0, y: 0 }; // 鼠标按下时的坐标
const isShowCrosshairImpont = ref(true);
const isCrosshair = ref(true);
// 多边形变量区----------------------------start
const polygonPoints: Point[] = []; // 点数组
let polygonTempLine: Line | null = null; // 临时线段
let polygonLines: Line[] = []; // 暂存线段
let polygonPreviewCircle: Circle | null = null;
const drawingPolygon = ref(false); // 是否进入多边形绘制模式
let currentPolygonPoints: { x: number; y: number }[] = [];
let tempCirclePoints: Circle[] = [];
let tempLinePoints: Line[] = [];
let polygonObject: Polygon | null = null;
let pointCacheData = [];
let editingPolygon: Polygon | null = null;
let editingGroup: Group | null = null;
let vertexCircles: Circle[] = [];
let tempPolygonPreview: Polygon | null = null; // 鼠标移动时的临时预览多边形
// 多边形变量结束区--------------------------end

// 复制粘贴----------------------------------start
const clipboard = ref<any>(null); // 存储复制的标注
const pastePosition = ref({ x: 0, y: 0 }); // 粘贴的初始位置
// 复制粘贴----------------------------------end

// 规则多边形----------------------------------start
const regularPolygon = ref(false);
// 规则多边形----------------------------------end

const currentZoom = ref(0); // 当前缩放的量
/**
 * 截取超链接最后一个/后的内容
 */
function getFilenameFromUrl(url) {
  // 将 URL 按 '/' 分割，取最后一部分
  return url.split("/").pop();
}

// 在组件卸载或图片切换时清理资源
const cleanupResources = () => {
  // 移除所有事件监听器
  if (fCanvas) {
    fCanvas.off("mouse:down");
    fCanvas.off("mouse:move");
    fCanvas.off("mouse:up");
    fCanvas.off("mouse:wheel");
    fCanvas.off("mouse:dblclick");
    fCanvas.off("object:modified");
  }

  // // 清理临时对象
  tempCirclePoints = [];
  tempLinePoints = [];
  currentPolygonPoints = [];

  if (tempPolygonPreview) {
    fCanvas?.remove(tempPolygonPreview);
    tempPolygonPreview = null;
  }
};

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

// 新增：将画布坐标转换为原始图片坐标
function convertCanvasToImageCoords(boundingBox, img) {
  const zoom = fCanvas.getZoom();
  const vpt = fCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];

  const imgDisplayWidth = img.width * img.scaleX;
  const imgDisplayHeight = img.height * img.scaleY;
  const imgCenterX = img.left;
  const imgCenterY = img.top;
  const imgBaseLeft = imgCenterX - imgDisplayWidth / 2;
  const imgBaseTop = imgCenterY - imgDisplayHeight / 2;

  // 转换函数：画布坐标 → 图片原始坐标
  const toImageOriginalPos = (point) => {
    const canvasX = (point.x - vpt[4]) / zoom;
    const canvasY = (point.y - vpt[5]) / zoom;
    const relativeX = canvasX - (imgBaseLeft - vpt[4]) / zoom;
    const relativeY = canvasY - (imgBaseTop - vpt[5]) / zoom;
    return {
      x: (relativeX / img.scaleX) * zoom,
      y: (relativeY / img.scaleY) * zoom,
    };
  };

  const pos1 = toImageOriginalPos({
    x: boundingBox.left,
    y: boundingBox.top,
  });

  const pos2 = toImageOriginalPos({
    x: boundingBox.left + boundingBox.width,
    y: boundingBox.top + boundingBox.height,
  });

  return [
    [pos1.x, pos1.y],
    [pos2.x, pos2.y],
  ];
}

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

// --------------复制粘贴功能开始-----------------

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
    // strokeWidth: 1,
    // cornerStrokeWidth: 1,
    selectable: true,
    evented: true,
    strokeUniform: true,
    subTargetCheck: true,
    strokeWidth: 1 / currentZoom.value, //  描边宽度
    cornerStrokeWidth: 1 / currentZoom.value, // 控制点边框的宽度
    type: "rect",
  });

  const tb = new Textbox(rectData.labelText, {
    left: Math.min(pos1Canvas.x, pos2Canvas.x) + 10,
    top: Math.min(pos1Canvas.y, pos2Canvas.y) + 10,
    // fontSize: 26,
    // fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
    // borderColor: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,

    fontSize: 12 / currentZoom.value,
    fill: "#fff", // 白字
    backgroundColor: "red",
    editable: false,
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
    strokeWidth: 0.5 / currentZoom.value,
    selectable: true,
    objectCaching: false,
    strokeUniform: true,
    evented: true,
    hasControls: false,
    hasBorders: false,
    perPixelTargetFind: true,
    noScaleCache: true,
  });

  // 6. 创建标签
  const label = new Textbox(polygonData.labelText, {
    fontSize: 12 / currentZoom.value,
    fill: "#fff", // 白字
    backgroundColor: "red", // 红底
    // fontSize: 16,
    // fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
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
// --------------复制粘贴功能结束-----------------
// 进入顶点编辑模式
function enterVertexEditing(polygon: Polygon) {
  editingPolygon = polygon;
  // 使用Fabric内置的多边形顶点编辑功能
  polygon.controls = controlsUtils.createPolyControls(polygon);

  // 设置控制点样式
  polygon.set({
    cornerStyle: "circle",
    cornerColor: "rgba(0,255,0,0.7)",
    cornerSize: 12,
    transparentCorners: false,
    hasBorders: false,
    hasControls: true, // 关键：必须设置为true
  });

  // 隐藏文本标签
  if ((polygon as any).label) {
    (polygon as any).label.visible = false;
  }

  polygon.setCoords();
  fCanvas.requestRenderAll();
}

// 退出顶点编辑模式
function exitVertexEditing(polygon: Polygon) {
  // 恢复默认控制
  polygon.controls = controlsUtils.createObjectDefaultControls();

  // 恢复默认样式
  polygon.set({
    cornerStyle: "rect",
    cornerColor: "blue",
    cornerSize: 10,
    transparentCorners: true,
    hasBorders: true,
    hasControls: false,
  });

  // 显示文本标签
  if ((polygon as any).label) {
    (polygon as any).label.visible = true;
  }
  // 更新存储的数据
  updatePolygonData(polygon);

  // 清除编辑状态
  editingPolygon = null;
  polygon.setCoords();
  fCanvas.requestRenderAll();

  // 清除编辑状态
  editingPolygon = null;
}

// 新增函数：更新多边形数据到 imageLabelData
function updatePolygonData(polygon: Polygon) {
  const img = fCanvas.getObjects("image")[0];
  if (!img) return;
  const zoom = fCanvas.getZoom();
  const vpt = fCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];
  // 计算图片位置
  const imgDisplayWidth = img.width! * img.scaleX!;
  const imgDisplayHeight = img.height! * img.scaleY!;
  const imgCenterX = img.left!;
  const imgCenterY = img.top!;
  const imgBaseLeft = imgCenterX - imgDisplayWidth / 2;
  const imgBaseTop = imgCenterY - imgDisplayHeight / 2;
  const imgLeft = (imgBaseLeft - vpt[4]) / zoom;
  const imgTop = (imgBaseTop - vpt[5]) / zoom;

  // 转换函数：画布坐标 → 图片原始坐标
  const toImageOriginalPos = (point: Point) => {
    const canvasX = (point.x - vpt[4]) / zoom;
    const canvasY = (point.y - vpt[5]) / zoom;
    const relativeX = canvasX - imgLeft;
    const relativeY = canvasY - imgTop;
    return {
      x: (relativeX / img.scaleX!) * zoom,
      y: (relativeY / img.scaleY!) * zoom,
    };
  };

  // 获取当前多边形的所有顶点（在画布上的绝对坐标）
  const points = polygon.points!.map((point) => {
    const localPoint = {
      x: point.x - polygon.pathOffset.x,
      y: point.y - polygon.pathOffset.y,
    };
    return util.transformPoint(localPoint, polygon.calcTransformMatrix());
  });

  // 转换为图片原始坐标
  const imagePoints = points.map((p) => toImageOriginalPos(p));

  // 更新存储的数据
  const polygonId = (polygon as any).id || (polygon as any).boxId;
  console.log("polygonId", polygonId);

  if (polygonId) {
    const index = imageLabelData[currentIndex.value].labelPolygonInfo.findIndex(
      (item: { id: any }) => item.id === polygonId
    );

    if (index !== -1) {
      imageLabelData[currentIndex.value].labelPolygonInfo[index].circlePoints =
        [...imagePoints];
      console.log(
        "Updated polygon data:",
        imageLabelData[currentIndex.value].labelPolygonInfo[index]
      );
    }
  }
}

async function finalizePolygon() {
  drawingPolygon.value = false;
  // 1. 去掉用户最后一个闭合点
  // currentPolygonPoints.pop();
  const pts = currentPolygonPoints;

  // 2. 创建临时 Polygon 实例，用于计算偏移和变换矩阵
  const polyTemp = new Polygon(pts, { objectCaching: false });

  // 3. 获取该对象相对画布的变换矩阵（包含缩放、平移、旋转等综合效果）
  const matrix = polyTemp.calcTransformMatrix(); // :contentReference[oaicite:1]{index=1}

  // 坐标转换开始----------------start
  // 1. 获取图片对象
  const img = fCanvas.getObjects("image")[0];
  if (!img) return;

  // 2. 获取画布变换参数
  const zoom = fCanvas.getZoom();
  const vpt = fCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];

  // 3. 计算图片实际显示尺寸
  const imgDisplayWidth = img.width * img.scaleX;
  const imgDisplayHeight = img.height * img.scaleY;

  // 4. 关键修复：计算图片在画布坐标系中的实际位置
  const imgCenterX = img.left;
  const imgCenterY = img.top;

  // 4.2 计算图片左上角在画布原始坐标系（未缩放）中的位置
  const imgBaseLeft = imgCenterX - imgDisplayWidth / 2;
  const imgBaseTop = imgCenterY - imgDisplayHeight / 2;

  // 转换为未缩放画布坐标系中的位置
  const imgLeft = (imgBaseLeft - vpt[4]) / zoom;
  const imgTop = (imgBaseTop - vpt[5]) / zoom;

  // 6. 转换函数：画布坐标 → 图片原始坐标
  const toImageOriginalPos = (point) => {
    // 6.1 移除画布变换
    const canvasX = (point.x - vpt[4]) / zoom;
    const canvasY = (point.y - vpt[5]) / zoom;

    // 6.2 转换为相对于图片左上角的坐标
    const relativeX = canvasX - imgLeft;
    const relativeY = canvasY - imgTop;

    // 6.3 转换为原始图片像素坐标，会有问题，最总结果需要乘以缩放的倍数
    return {
      x: (relativeX / img.scaleX) * zoom,
      y: (relativeY / img.scaleY) * zoom,
    };
  };
  const tempArr = pts.map((p) => {
    const relative = toImageOriginalPos({ x: p.x, y: p.y });
    return relative;
  });
  pointCacheData.push(tempArr);

  const polygonId = `box_${Date.now()}`;

  // 坐标转换结束------------------end

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
    strokeWidth: 0.5 / currentZoom.value,
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

  // 设置多边形ID
  finalPoly.set({ id: polygonId });
  finalPoly.on("modified", () => {
    updatePolygonData(finalPoly);
  });
  // 关键修改：添加双击事件处理
  finalPoly.on("mousedblclick", () => {
    if (editingPolygon === finalPoly) {
      console.log(imageLabelData[currentIndex.value].labelPolygonInfo);
      exitVertexEditing(finalPoly);
    } else {
      // 确保只有一个多边形处于编辑状态

      if (editingPolygon) exitVertexEditing(editingPolygon);

      console.log(imageLabelData[currentIndex.value].labelPolygonInfo);
      enterVertexEditing(finalPoly);
    }
  });

  finalPoly.on("modified", () => {
    updatePolygonData(finalPoly);
  });
  fCanvas.add(finalPoly);
  fCanvas.setActiveObject(finalPoly);

  // 记录绘制完成时用户最后点击 canvas 的位置，用于定位弹窗
  const canvasEl = canvas.value!.parentElement! as HTMLElement;

  // — 弹出 label 输入框
  const label = await promptPolygonLabel(finalPoly, startPos, canvasEl);

  if (!label) {
    // 用户取消或者不输入标签 → 移除 finalPoly 并退出绘制模式
    fCanvas.remove(finalPoly);
    drawingPolygon.value = false;
    isCrosshair.value = true;
    //  清除临时绘制残留的点线
    clearTempDraw();
    return;
  }

  // 6. 创建文本标签 - 不再使用Group
  const center = finalPoly.getCenterPoint();

  const rgbTempColor: any = stringToColour(label);
  const tb = new Textbox(label, {
    left: center.x,
    top: center.y,
    // fontSize: 16,
    // fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,

    fontSize: 12 / currentZoom.value,
    fill: "#fff", // 白字
    backgroundColor: "red", // 红底
    originX: "center",
    originY: "center",
    editable: false,
    selectable: false,
    evented: false, // 文本不响应事件
    hoverCursor: "default",
  });

  tb.set({ id: polygonId });
  finalPoly.set({
    fill: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0.2)`,
    borderColor: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},1)`,
    stroke: `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},1)`, // 设置边框颜色为蓝色
  });

  finalPoly.on("mouseover", () => {
    finalPoly.set(
      "fill",
      `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0.2)`
    );
    fCanvas.renderAll();
  });

  finalPoly.on("mouseout", () => {
    finalPoly.set(
      "fill",
      `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0.01)`
    );
    fCanvas.renderAll();
  });
  fCanvas.add(tb);
  // 关键修改：将文本标签与多边形关联
  (finalPoly as any).label = tb;

  function updateLabelPosition() {
    const center = finalPoly.getCenterPoint();
    tb.set({
      left: center.x,
      top: center.y,
      angle: finalPoly.angle || 0,
    });
    tb.setCoords();
    fCanvas.requestRenderAll();
  }

  // 监听多边形变换，更新标签位置
  finalPoly.on("moving", updateLabelPosition);
  finalPoly.on("scaling", updateLabelPosition);
  finalPoly.on("rotating", updateLabelPosition);

  // 7. 清除绘制时遗留的临时点/线
  clearTempDraw();
  drawingPolygon.value = false;

  // 8. 记录生成的 polygon 对象
  polygonObject = finalPoly;
  // 添加文本标签后立即更新一次数据
  setTimeout(() => updatePolygonData(finalPoly), 0);
  imageLabelData[currentIndex.value].labelPolygonInfo.push({
    labelText: label,
    id: polygonId,
    circlePoints: [...pointCacheData],
  });
}
function getColorByText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}
function promptLabelForPolygon(polygon: Polygon) {
  const text = prompt("请输入标签文本") || "未命名";
  const color = getColorByText(text);
  polygon.set("labelText", text);
  polygon.set("stroke", color);
  polygon.set("fill", color + "33"); // 半透明

  fCanvas.renderAll();

  // 添加到你的 labelInfo 数据中
  // 你需要加一个 type: 'polygon' 来区分类型
}
// 绘制实心绿色圆形【控制点绘制】
function renderSolidGreenCircle(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number
) {
  const size = 10;
  ctx.save();
  ctx.fillStyle = "#00FF00";
  ctx.beginPath();
  ctx.arc(left, top, size / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

// 添加全局变量记录当前悬停的控制点
let hoveredControl = null;
// 将十六进制颜色值转换成RGB数组
function hexToRgb(hex: any) {
  // 移除可能存在的#
  hex = hex.replace(/^#/, "");
  // 解析r、g、b的值
  let r: any = parseInt(hex.substring(0, 2), 16),
    g: any = parseInt(hex.substring(2, 4), 16),
    b: any = parseInt(hex.substring(4, 6), 16);
  return { r, g, b }; // 返回对象形式的RGB值
}

function showCross() {
  isShowCrosshairImpont.value = true;
  isCrosshair.value = true;
}

function toPercent(numStr) {
  const decimal = parseFloat(numStr);
  if (isNaN(decimal)) return "0%";
  const percentage = Math.round(decimal * 100); // 四舍五入到整数
  return percentage + "%";
}

// 通过哈希算法计算将字符串计算为随机且固定的颜色值
// 将字符串转为固定颜色（基于 MD5）
function stringToColour(str, isRgb = true) {
  // 生成 MD5 哈希值（16进制字符串）
  const hash = CryptoJS.MD5(str).toString();

  // 取前6位作为颜色值
  const colour = "#" + hash.substr(0, 6);

  // 如果需要返回 RGB 格式
  if (isRgb) {
    return hexToRgb(colour);
  } else {
    return colour;
  }
}
// 修改渲染函数，支持悬停状态
function renderControlPoint(ctx, left, top, styleOverride, fabricObject) {
  const size = this.cornerSize;
  ctx.save();

  // 检查是否是当前悬停的控制点
  if (this.name === hoveredControl) {
    // 绘制红色矩形
    ctx.fillStyle = "red";
    ctx.fillRect(left - size / 2, top - size / 2, size, size);
  } else {
    // 绘制绿色圆形（原始样式）
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(left, top, size / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

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
    ml: new Control({
      ...commonOpts,
      x: -0.5,
      y: 0,

      cursorStyle: "w-resize",
      actionHandler: controlsUtils.scalingX,
    }),
    // 右边中点 - 横向缩放
    mr: new Control({
      ...commonOpts,
      x: 0.5,
      y: 0,
      cursorStyle: "e-resize",
      actionHandler: controlsUtils.scalingX,
    }),
    // 上边中点 - 纵向缩放
    mt: new Control({
      ...commonOpts,
      x: 0,
      y: -0.5,
      cursorStyle: "n-resize",
      actionHandler: controlsUtils.scalingY,
    }),
    // 下边中点 - 纵向缩放
    mb: new Control({
      ...commonOpts,
      x: 0,
      y: 0.5,
      cursorStyle: "s-resize",
      actionHandler: controlsUtils.scalingY,
    }),

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
    uniformScaling: false,
  });
}

function addLabeledRect(rect: Rect, label: string) {
  const id = `box_${Date.now()}`;
  const style = { color: "#ff00ff", background: "" };
  const img = fCanvas.getObjects("image")[0] as FabricImage;
  const rgbTempColor: any = stringToColour(label);
  // rect.set(
  //   "fill",
  //   `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0.05)`
  // );
  rect.set(
    "stroke",
    `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`
  );

  const tb = new Textbox(label, {
    left: rect.left! + 5,
    top: rect.top! + 5,

    editable: false,
    fontSize: 12 / currentZoom.value,
    fill: "#fff", // 白字
    backgroundColor: "red", // 红底
    // fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
    // borderColor: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
    selectable: false,
    evented: false, // 不参与事件
    // backgroundColor: style.background,
  });
  const group = new Group([rect], {
    hasBorders: false,
    selectable: true,
    evented: true,
    subTargetCheck: true,
  });
  (group as any).boxId = id; // 不要用 set，直接设置属性
  const left = group.left!;
  const top = group.top!;
  // 设置头顶的旋转点的旋转中心
  group.set({
    originX: "center",
    originY: "center",
  });
  // 设置 group 的位置
  group.set({
    left: left + group.width / 2,
    top: top + group.height / 2,
  });
  // 更新 group 的坐标
  group.setCoords();
  // 设置操作点
  group.controls = createCustomControls();
  rect.controls = createCustomControls();
  // 添加 group 到画布
  fCanvas.add(group);
  fCanvas.add(tb);
  // 更新画布
  fCanvas.requestRenderAll();

  //--------------------------start-------------------------
  // 2. 获取画布变换参数
  const zoom = fCanvas.getZoom();
  const vpt = fCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];

  // 3. 计算图片实际显示尺寸
  const imgDisplayWidth = img.width! * img.scaleX;
  const imgDisplayHeight = img.height! * img.scaleY;

  // 4.1 获取图片中心点在画布坐标系中的位置
  const imgCenterX = img.left!;
  const imgCenterY = img.top!;

  // 4.2 计算图片左上角在画布原始坐标系（未缩放）中的位置
  const imgBaseLeft = imgCenterX - imgDisplayWidth / 2;
  const imgBaseTop = imgCenterY - imgDisplayHeight / 2;

  // 4.3 转换为未缩放画布坐标系中的位置
  const imgLeft = (imgBaseLeft - vpt[4]) / zoom;
  const imgTop = (imgBaseTop - vpt[5]) / zoom;

  //   const rectIndo = rect.getBoundingRect(true);

  const rectIndo = rect.getBoundingRect();
  // 6. 转换函数：画布坐标 → 图片原始坐标
  const toImageOriginalPos = (point: Point) => {
    // 6.1 移除画布变换
    const canvasX = (point.x - vpt[4]) / zoom;
    const canvasY = (point.y - vpt[5]) / zoom;

    // 6.2 转换为相对于图片左上角的坐标
    const relativeX = canvasX - imgLeft;
    const relativeY = canvasY - imgTop;

    // 6.3 转换为原始图片像素坐标
    return [(relativeX / img.scaleX) * zoom, (relativeY / img.scaleY) * zoom];
  };

  // 8. 转换坐标
  const newPos1 = toImageOriginalPos(new Point(rectIndo.left, rectIndo.top));
  const newPos2 = toImageOriginalPos(
    new Point(rectIndo.left + rectIndo.width, rectIndo.top + rectIndo.height)
  );
  console.log("newPos1,newPos2", newPos1, newPos2);
  // 打开十字控制线
  isCrosshair.value = true;
  //--------------------------end---------------------------
  // 创建标签数据
  imageLabelData[currentIndex.value].labelInfo.push({
    id,
    pos1: newPos1,
    pos2: newPos2,
    labelText: label,
    labelStyle: style,
    fabricGroup: group,
  });

  (rect as any).labelRef = label;
  (rect as any).boxId = id;
  // 拖动时同步 label 位置
  group.on("moving", () => {
    const boundingBox = group.getBoundingRect(); // 获取绝对左上角
    tb.set({
      left: boundingBox.left + 5,
      top: boundingBox.top + 5,
    });
  });
  group.on("mouseover", () => {
    rect.set(
      "fill",
      `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0.05)`
    );
    fCanvas.renderAll();
  });
  group.on("mouseout", () => {
    rect.set(
      "fill",
      `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0)`
    );
    fCanvas.renderAll();
  });
  rect.on("mousedown", (e) => {
    // 选中当前 rectSmall 对象
    // fCanvas.setActiveObject(rect);
    // // 重新渲图——必要，否则选中框不会出现
    // fCanvas.requestRenderAll();
    const obj: any = e.target as any;
    if (obj && obj.boxId) {
      selectedLabelId.value = obj.boxId;
    }
    console.log("已选中小矩形", selectedLabelId.value);
  });

  (group as any).mainRect = rect;
  (rect as any).labelRef = tb;
  (group as any).boxId = id;
  (rect as any).boxId = id;
  (tb as any).boxId = id;
  (rect as any).labelRef = tb;
  group.on("scaling", () => {
    const rect = (group as any).mainRect;
    const label = (rect as any).labelRef;
    const boundingBox = group.getBoundingRect(); // 获取绝对左上角
    label.set({
      left: boundingBox.left + 5,
      top: boundingBox.top + 5,
    });
  });

  rect.set(
    "fill",
    `rgba(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b},0)`
  );
  // 设置当前正在编辑的 labelId
  editingLabelId.value = id;
}

function promptPolygonLabel(
  finalPoly: Polygon,
  startPos: Point,
  canvasWrapper: HTMLElement
): Promise<string | null> {
  return new Promise((resolve) => {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = `${startPos.x - 122}px`;
    div.style.top = `${startPos.y}px`;
    div.style.padding = "4px";
    div.style.background = "white";
    // div.innerHTML = `
    //   <input type="text" placeholder="请输入标签" style="width:100px"/>
    //   <button data-action="ok">创建</button>
    //   <button data-action="cancel">取消</button>
    // `;
    const optionsHtml = defectOptions1
      .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
      .join("");
    div.innerHTML = `
    <select style="width: 120px;">
      <option value="" disabled selected>请选择缺陷类型</option>
      ${optionsHtml}
    </select>
    <button data-action="ok">确认</button>
    <button data-action="cancel">取消</button>
  `;
    const selectEl = div.querySelector("select") as HTMLSelectElement;
    canvasWrapper.append(div);

    const cleanup = () => {
      canvasWrapper.removeChild(div);
    };
    // 让输入框获取焦点
    selectEl.focus();
    div.addEventListener("click", function onClick(e) {
      const btn = (e.target as HTMLElement).dataset.action;
      if (btn === "ok") {
        // const label = input.value.trim();
        const selectedValue = selectEl.value;
        const selectedOption = defectOptions1.find(
          (opt) => opt.value === selectedValue
        );

        cleanup();
        div.removeEventListener("click", onClick);
        if (selectedOption) {
          // 调用添加标签矩形函数
          resolve(selectedOption.label || null);
        }
        //
      } else if (btn === "cancel") {
        cleanup();
        div.removeEventListener("click", onClick);
        resolve(null);
      }
    });
  });
}

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
  // div.innerHTML = `
  //     <input type="text" placeholder="请输入Label" style="width:100px"/>
  //     <button data-action="ok">创建</button>
  //     <button data-action="cancel">取消</button>
  //   `;
  // 使用 <select> 替换 input 结构
  const optionsHtml = defectOptions1
    .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
    .join("");
  div.innerHTML = `
    <select style="width: 120px;">
      <option value="" disabled selected>请选择缺陷类型</option>
      ${optionsHtml}
    </select>
    <button data-action="ok">确认</button>
    <button data-action="cancel">取消</button>
  `;

  // 添加到画布
  wrapper.append(div);
  // 选中input输入框
  // const input = div.querySelector("input") as HTMLInputElement;
  const selectEl = div.querySelector("select") as HTMLSelectElement;
  // 让输入框获取焦点
  selectEl.focus();
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
      // const label = input.value.trim();
      // if (label) addLabeledRect(rect, label);
      // // 移除临时的矩形
      // cleanup();
      const selectedValue = selectEl.value;
      const selectedOption = defectOptions1.find(
        (opt) => opt.value === selectedValue
      );
      if (selectedOption) {
        // 调用添加标签矩形函数
        addLabeledRect(rect, selectedOption.label);
      }
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
function showEditLabel(rect: Rect, tb: Textbox, done: () => void) {
  console.log("showEditLabel", rect, tb);
  // 创建一个输入框
  const wrapper = canvas.value!.parentElement! as HTMLElement;
  // 创建一个div
  const div = document.createElement("div");
  // 设置div的样式
  div.style.position = "absolute";
  // 设置div的left与top保证右下角偏移
  div.style.left = `${tb.left!}px`;
  div.style.top = `${tb.top! + tb.height! + 5}px`;
  // 设置div的背景颜色为白色
  div.style.background = "white";
  // 设置div的内容为输入框，底部两个按钮
  div.innerHTML = `
      <input type="text" style="width:100px" value="${tb.text}"/>
      <button data-action="ok">保存</button>
      <button data-action="cancel">取消</button>
    `;
  wrapper.append(div);
  // 添加事件监听器
  const input = div.querySelector("input") as HTMLInputElement;
  input.focus();
  const cleanup = () => {
    wrapper.removeChild(div);
    done();
  };
  div.addEventListener("click", (e) => {
    // 获取按钮名称
    const btn = (e.target as HTMLElement).dataset.action;
    // 处理按钮点击
    if (btn === "ok") {
      // 保存标签
      tb.text = input.value.trim() || tb.text;
      // 删除标签
      cleanup();
    } else if (btn === "cancel") {
      // 删除标签
      cleanup();
    }
  });
}
function confirmEditLabel() {
  if (labelType.value == "rect") {
    if (!editingLabelId.value) return;
    // 获取 label 对象
    const label = imageLabelData[currentIndex.value].labelInfo.find(
      (b: any) => b.id === editingLabelId.value
    );

    if (!label) return;

    const selectedOption = defectOptions1.find(
      (opt) => opt.value === editLabelText.value
    );
    label.labelText = selectedOption.label;

    // label.labelText = editLabelText.value;

    // 找 canvas 上的 group
    const group = fCanvas
      .getObjects()
      .find((o) => (o as any).boxId === editingLabelId.value) as
      | Group
      | undefined;

    if (!group) {
      console.warn("未找到对应的 group");
      return;
    }
    // 找 group 中的 textbox
    // const textbox = group._objects.find(
    //   (obj) => obj instanceof Textbox
    // ) as Textbox;

    const textbox = fCanvas
      .getObjects()
      .find(
        (o) => o instanceof Textbox && (o as any).boxId === editingLabelId.value
      ) as Textbox;
    // 重新生成颜色
    const rgb = stringToColour(label.labelText) as {
      r: number;
      g: number;
      b: number;
    };
    const id = editingLabelId.value;
    const color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const obj = fCanvas.getObjects().find((o: any) => o.boxId === id);
    if (!obj) return;

    // 获取 Rect 和 Textbox 实例
    //
    // const rect: Rect = obj._objects?.[0] ?? (obj as Rect);
    const rect: Rect = obj?.[0] ?? (obj as Rect);

    console.log("重新生成颜色", rect);
    rect.set({ stroke: color, fill: `rgba(${rgb.r},${rgb.g},${rgb.b},0)` });
    rect.set("fill", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b},0)`);

    // 更新 textbox 的内容
    if (textbox) {
      const selectedOption = defectOptions1.find(
        (opt) => opt.value === editLabelText.value
      );
      textbox.set("fill", color);
      textbox.set("text", selectedOption.label); // 不直接赋值
      textbox.initDimensions(); // 重算内部尺寸和行
      textbox.setCoords(); // 更新坐标（对拖动/碰撞有帮助）
    }
    fCanvas.requestRenderAll();
    // 清空编辑状态
    editingLabelId.value = null;
    editingLabel.value = false;
  } else if (labelType.value == "polygon") {
    if (!editingLabelId.value) return;

    // 获取 label 对象
    const label = imageLabelData[currentIndex.value].labelPolygonInfo.find(
      (b: any) => b.id === editingLabelId.value
    );
    if (!label) return;
    const selectedOption = defectOptions1.find(
      (opt) => opt.value === editLabelText.value
    );
    label.labelText = selectedOption.label;
    console.log("label", label);
    // 找 canvas 上的 text 对象
    const textbox: any = fCanvas
      .getObjects()
      .find((o) => (o as any).id === editingLabelId.value) as
      | Textbox
      | undefined;
    console.log("textbox", textbox);
    if (!textbox) {
      console.warn("未找到对应的 textbox");
      return;
    }

    const polygon = fCanvas
      .getObjects()
      .find((o) => (o as any).id === editingLabelId.value) as
      | Textbox
      | undefined;
    if (!polygon) {
      console.warn("未找到对应的 polygon");
      return;
    }

    // 重新生成颜色
    const rgb = stringToColour(label.labelText) as {
      r: number;
      g: number;
      b: number;
    };

    const id = editingLabelId.value;
    const color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const obj = fCanvas.getObjects().find((o: any) => o.id === id);
    if (!obj) return;
    if (polygon) {
      polygon.set({
        stroke: color,
        fill: `rgba(${rgb.r},${rgb.g},${rgb.b},0.1)`,
      });
      polygon.on("mouseover", () => {
        polygon.set("fill", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b},0.2)`);
        fCanvas.renderAll();
      });

      polygon.on("mouseout", () => {
        polygon.set("fill", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b},0.01)`);
        fCanvas.renderAll();
      });
    }
    if (textbox) {
      const selectedOption = defectOptions1.find(
        (opt) => opt.value === editLabelText.value
      );
      textbox.label.set({ fill: color, text: selectedOption.label.trim() });
      textbox.label.set({ dirty: true });
      textbox.label.setCoords();
    }
    // console.log("找 canvas 上的 group", textbox, polygon);
    fCanvas.renderAll();
    fCanvas.requestRenderAll();
    // 清空编辑状态
    editingLabelId.value = null;
    editingLabel.value = false;
  }
}
// 修改信息
function startEditLabel(id: string, type?: any) {
  if (type == "rect") {
    labelType.value = "rect";
    const label = imageLabelData[currentIndex.value].labelInfo.find(
      (b: any) => b.id === id
    );
    if (!label) return;

    editLabelText.value = label.labelText;
    editingLabelId.value = id;
    editingLabel.value = true;
  } else if (type == "polygon") {
    labelType.value = "polygon";
    const label = imageLabelData[currentIndex.value].labelPolygonInfo.find(
      (b: any) => b.id === id
    );
    if (!label) return;
    editLabelText.value = label.labelText;
    editingLabelId.value = id;
    editingLabel.value = true;
  }
}
function removePolygon(id: string) {
  if (!id) return;

  // 1. 找到画布上对应的多边形对象
  const poly = fCanvas.getObjects().find((obj: any) => obj.id === id);
  if (poly) {
    fCanvas.remove(poly);
  }

  // 2. 下·找到关联的文本标签（Textbox），id 和多边形相同
  const textbox = fCanvas
    .getObjects()
    .find((obj: any) => obj.id === id && obj.type === "textbox");
  if (textbox) {
    fCanvas.remove(textbox);
  }

  // 3. 从数据源中移除对应的标签数据（多边形标签数据和普通标签数据）
  imageLabelData[currentIndex.value].labelPolygonInfo = imageLabelData[
    currentIndex.value
  ].labelPolygonInfo.filter((label) => label.id !== id);

  imageLabelData[currentIndex.value].labelInfo = imageLabelData[
    currentIndex.value
  ].labelInfo.filter((label) => label.id !== id);

  // 4. 画布重绘
  fCanvas.requestRenderAll();
}
// 移除矩形框
function removeBox(id: string) {
  // 删除带boxId的Group
  const targets = fCanvas.getObjects().filter((o) => (o as any).boxId === id);
  targets.forEach((o) => {
    fCanvas.remove(o);
  });
  // 额外删除残留的未绑定boxId的矩形（  可能是临时框）
  fCanvas.getObjects("rect").forEach((o) => {
    if (!(o as any).boxId) {
      fCanvas.remove(o);
    }
  });
  fCanvas.discardActiveObject();
  fCanvas.calcOffset();
  fCanvas.requestRenderAll();
  imageLabelData[currentIndex.value].labelInfo = imageLabelData[
    currentIndex.value
  ].labelInfo.filter((b) => b.id !== id);
}

function labelClick(item: LabelInfo) {
  selectedLabelId.value = item.id;
  // 1. 清除当前选中状态
  fCanvas.discardActiveObject();
  // 2. 找到对应对象（Group 或 Rect）
  const obj = fCanvas.getObjects().find((o: any) => o.boxId === item.id);
  if (obj) {
    // 3. 设置为当前激活对象，让框和控制点出现
    fCanvas.setActiveObject(obj);
    fCanvas.requestRenderAll();
  }
}
let crossCanvas: HTMLCanvasElement | null = null;
function createCrossCanvas(container: HTMLElement) {
  // 先看看有没有已经创建的，避免重复创建
  let crossCanvas = container.querySelector<HTMLCanvasElement>(".cross-canvas");
  if (crossCanvas) return crossCanvas;

  crossCanvas = document.createElement("canvas");
  crossCanvas.id = "cross-canvas"; // 动态设置 id
  crossCanvas.classList.add("cross-canvas");
  crossCanvas.style.position = "absolute";
  crossCanvas.style.top = "0";
  crossCanvas.style.left = "0";
  crossCanvas.style.width = "100%";
  crossCanvas.style.height = "100%";
  crossCanvas.style.pointerEvents = "none"; // 事件透传到底层fabric canvas
  crossCanvas.style.zIndex = "9999"; // 保证最上层
  container.appendChild(crossCanvas);

  // 设置canvas物理像素尺寸，防止模糊
  crossCanvas.width = container.clientWidth;
  crossCanvas.height = container.clientHeight;

  return crossCanvas;
}

function showCrossLine() {
  if (crossCanvas) crossCanvas.style.display = "block";
}

function hideCrossLine() {
  if (crossCanvas) {
    crossCanvas.style.display = "none";
    const ctx = crossCanvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, crossCanvas.width, crossCanvas.height);
  }
}

// 异步加载图片
async function loadImage(url: string) {
  // 确保先移除旧事件
  // 如果fabric未初始化，则输出警告并返回
  if (!fCanvas) {
    console.warn("fCanvas 未初始化");
    return;
  }

  // "http://192.168.80.32:8888/Image_20250306140749112.png"
  try {
    // 使用Fabric加载图片，并设置跨域资源共享(CORS)为匿名
    const imgObj = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    // console.log("图片加载完成", imgObj);

    // 获取画布容器的Dom元素，并计算缩放比例
    const container = fCanvas.getElement().parentElement as HTMLElement;
    const scale = container.clientHeight / imgObj.height!;

    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseleave", onMouseLeave);
    imgScale = container.clientHeight / imgObj.height!;
    // imgObj.scale(imgScale);
    // 应用缩放比例，并设置图片在画布中的位置
    imgObj.scale(scale);
    // 设置图片的居中位置 线上线下融合
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
    currentZoom.value = fCanvas.getZoom();
    // 重置视口变换，并请求重新渲染整个画布
    fCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    fCanvas.requestRenderAll();
    drawLabels(imageLabelData[currentIndex.value].labelInfo, imgObj);

    drawPolygons(imageLabelData[currentIndex.value].labelPolygonInfo, imgObj);

    // 创建或获取顶层canvas
    const crossCanvas = createCrossCanvas(container);
    crossCanvasDom.value = createCrossCanvas(container);
    const ctx = crossCanvas.getContext("2d")!;
    // 绑定鼠标移动事件绘制十字线（注意要先解绑避免重复绑定）
    container.removeEventListener("mousemove", onMouseMove);
    container.addEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseleave", onMouseLeave);
    container.addEventListener("mouseleave", onMouseLeave);

    // 使用自定义的节流函数
    fCanvas.on(
      "mouse:move",
      throttle(function (opt) {
        // if (!opt.target || opt.target !== imgObj) return;
        const pointer = fCanvas.getPointer(opt.e, true);
        const vpt = fCanvas.viewportTransform;

        // 将鼠标指针从canvas坐标系转换到视口坐标系
        const canvasX = (pointer.x - vpt[4]) / vpt[0];
        const canvasY = (pointer.y - vpt[5]) / vpt[3];

        // 计算图像左上角在canvas上的坐标
        const imgLeftTopX = imgObj.left - (imgObj.width * imgObj.scaleX) / 2;
        const imgLeftTopY = imgObj.top - (imgObj.height * imgObj.scaleY) / 2;

        // 转换为相对于图像左上角的坐标
        const relativeX = (canvasX - imgLeftTopX) / imgObj.scaleX;
        const relativeY = (canvasY - imgLeftTopY) / imgObj.scaleY;

        // console.log(
        //   "Mouse in original image:",
        //   Math.round(relativeX),
        //   Math.round(relativeY)
        // );
        currentMousePositionX.value = Math.round(relativeX);
        currentMousePositionY.value = Math.round(relativeY);
      }, 5)
    ); // 每16ms执行一次
    // fCanvas.on("mouse:move", (opt) => {
    //   // if (!opt.target || opt.target !== imgObj) return;
    //   const pointer = fCanvas.getPointer(opt.e, true);
    //   const vpt = fCanvas.viewportTransform;

    //   // 将鼠标指针从canvas坐标系转换到视口坐标系
    //   const canvasX = (pointer.x - vpt[4]) / vpt[0];
    //   const canvasY = (pointer.y - vpt[5]) / vpt[3];

    //   // 计算图像左上角在canvas上的坐标
    //   const imgLeftTopX = imgObj.left - (imgObj.width * imgObj.scaleX) / 2;
    //   const imgLeftTopY = imgObj.top - (imgObj.height * imgObj.scaleY) / 2;

    //   // 转换为相对于图像左上角的坐标
    //   const relativeX = (canvasX - imgLeftTopX) / imgObj.scaleX;
    //   const relativeY = (canvasY - imgLeftTopY) / imgObj.scaleY;

    //   // console.log(
    //   //   "Mouse in original image:",
    //   //   Math.round(relativeX),
    //   //   Math.round(relativeY)
    //   // );
    //   currentMousePositionX.value = Math.round(relativeX);
    //   currentMousePositionY.value = Math.round(relativeY);
    // });

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
const LABEL_OFFSET_Y = 20; // 可根据需要微调
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
      // strokeWidth: 1,
      selectable: true,
      // cornerStrokeWidth: 1,
      strokeUniform: true, // 确保缩放时描边宽度不变
      originX: "left",
      originY: "top",

      strokeWidth: 1 / currentZoom.value, //  描边宽度
      cornerStrokeWidth: 1 / currentZoom.value, // 控制点边框的宽度
    });
    // 创建文字标签，不加入 group
    const label = new Textbox(item.labelText, {
      left: left,
      top: top, // 显示在矩形上方
      // fontSize: 26,
      // fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
      editable: false,
      // borderColor: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,

      fontSize: 12 / currentZoom.value,
      fill: "#fff", // 白字
      backgroundColor: "red", // 红底
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

// 绘制多边形标注框
function drawPolygons(labelPolygonInfo: any[], imgObj: any) {
  const imgLeft = imgObj.left!;
  const imgTop = imgObj.top!;
  const imgDisplayWidth = imgObj.getScaledWidth();
  const imgDisplayHeight = imgObj.getScaledHeight();

  const imgBaseLeft = imgLeft - imgDisplayWidth / 2;
  const imgBaseTop = imgTop - imgDisplayHeight / 2;

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
      strokeWidth: 0.5 / currentZoom.value,
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
      fontSize: 12 / currentZoom.value,
      fill: "#fff", // 白字
      backgroundColor: "red", // 红底
      // fontSize: 16,
      // fill: `rgb(${rgbTempColor.r}, ${rgbTempColor.g}, ${rgbTempColor.b})`,
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

// 取消多边形绘制函数
function cancelPolygonDrawing() {
  // 移除临时圆点
  tempCirclePoints.forEach((c) => fCanvas.remove(c));
  tempCirclePoints = [];

  // 移除临时线
  tempLinePoints.forEach((l) => fCanvas.remove(l));
  tempLinePoints = [];

  // 移除临时多边形预览
  if (tempPolygonPreview) {
    fCanvas.remove(tempPolygonPreview);
    tempPolygonPreview = null;
  }

  // 清空点数组
  currentPolygonPoints = [];

  // 重置绘制状态
  drawingPolygon.value = false;

  // 恢复画布可选状态
  fCanvas.selection = true;
  fCanvas.forEachObject((o) => {
    o.selectable = true;
    o.evented = true;
  });

  fCanvas.requestRenderAll();
}
// 当都节流方法
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 绑定事件：平移、缩放
function setupEventListeners() {
  // 如果Fabric画布未初始化，则直接返回
  if (!fCanvas) return;
  // 解绑旧的 mouse:down 监听，避免切换图片的时候叠加上一张图的事件
  fCanvas.off("mouse:down");
  // 键盘监听
  window.addEventListener("keydown", (e) => {
    // 如果按下W键，则开始绘制
    if (e.key === "w" && !drawing && !editing) {
      // 禁止选择
      fCanvas.selection = false;
      drawing = true;
      fCanvas.defaultCursor = "crosshair";
      fCanvas.forEachObject((o) => {
        o.selectable = false;
        o.evented = false;
      });
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "w" || drawing) {
      // drawing = false;
      fCanvas.selection = false;
    }
  });

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
      // fCanvas.requestRenderAll();
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
    if (currentPolygonPoints.length >= 3 && distance(point, first) < 2) {
      finalizePolygon();
      return;
    }

    // 否则正常添加新点
    currentPolygonPoints.push(point);
    addTempCircle(point);
    addTempLine();
  });

  // 全部可选项进行双击修改标签内容
  fCanvas.on("mouse:dblclick", (e) => {
    const obj = e.target as any;
    if (obj && obj.boxId) {
      startEditLabel(obj.boxId, "rect");
    }
    if (obj && obj.isPolygonGroup) {
      // enterPolygonEditMode(obj);
    }
  });

  // 对象单选时也触发
  fCanvas.on("object:modified", (e) => {
    const obj = e.target;
    if (!obj) return;
    const boxId = (obj as any).boxId;
    if (!boxId) return;

    // 1. 获取图片对象
    const img = fCanvas.getObjects("image")[0];
    if (!img) return;

    // 2. 获取画布变换参数
    const zoom = fCanvas.getZoom();
    const vpt = fCanvas.viewportTransform || [1, 0, 0, 1, 0, 0];

    // 3. 计算图片实际显示尺寸
    const imgDisplayWidth = img.width! * img.scaleX;
    const imgDisplayHeight = img.height! * img.scaleY;

    // 4. 关键修复：计算图片在画布坐标系中的实际位置
    // -------------------------------------------------
    // 4.1 获取图片中心点在画布坐标系中的位置
    const imgCenterX = img.left!;
    const imgCenterY = img.top!;

    // 4.2 计算图片左上角在画布原始坐标系（未缩放）中的位置
    const imgBaseLeft = imgCenterX - imgDisplayWidth / 2;
    const imgBaseTop = imgCenterY - imgDisplayHeight / 2;

    //  转换为未缩放画布坐标系中的位置
    const imgLeft = (imgBaseLeft - vpt[4]) / zoom;
    const imgTop = (imgBaseTop - vpt[5]) / zoom;
    // -------------------------------------------------

    // 5. 获取矩形边界
    // const rect = obj.getBoundingRect(true);
    const rect = obj.getBoundingRect();
    // 6. 转换函数：画布坐标 → 图片原始坐标
    const toImageOriginalPos = (point: Point) => {
      // 6.1 移除画布变换
      const canvasX = (point.x - vpt[4]) / zoom;
      const canvasY = (point.y - vpt[5]) / zoom;

      // 6.2 转换为相对于图片左上角的坐标
      const relativeX = canvasX - imgLeft;
      const relativeY = canvasY - imgTop;

      // 6.3 转换为原始图片像素坐标，会有问题，最总结果需要乘以缩放的倍数
      // return [relativeX / img.scaleX, relativeY / img.scaleY];
      return [(relativeX / img.scaleX) * zoom, (relativeY / img.scaleY) * zoom];
    };

    // 7. 找到对应标签
    const label = imageLabelData[currentIndex.value].labelInfo.find(
      (l: any) => l.id === boxId
    );
    if (!label) return;
    // const labelObj = fCanvas
    //   .getObjects()
    //   .find((o) => o.boxId === obj.boxId && o.type === "textbox");
    // 8. 转换坐标
    const newPos1 = toImageOriginalPos(new Point(rect.left, rect.top));
    const newPos2 = toImageOriginalPos(
      new Point(rect.left + rect.width, rect.top + rect.height)
    );

    // 9. 边界约束（确保在图片范围内）
    const clamp = (val: number, max: number) => Math.max(0, Math.min(max, val));

    label.pos1 = [
      clamp(newPos1[0], img.width!),
      clamp(newPos1[1], img.height!),
    ];

    label.pos2 = [
      clamp(newPos2[0], img.width!),
      clamp(newPos2[1], img.height!),
    ];

    console.log("修正后坐标:", {
      rect: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      },
      vpt,
      zoom,
      imgBase: { left: imgBaseLeft, top: imgBaseTop },
      imgUnscaled: { left: imgLeft, top: imgTop },
      newPos1,
      newPos2,
      finalPos1: label.pos1,
      finalPos2: label.pos2,
    });
  });

  // 监听鼠标按下事件
  fCanvas.on("mouse:down", (opt) => {
    console.log("mouse:down", drawing);
    // 获取鼠标位置
    const e = opt.e as MouseEvent;
    if (drawing) {
      // 获取鼠标位置
      const p = fCanvas.getPointer(e);
      startX = p.x;
      startY = p.y;
      // 1. 复用对象，不要 remove + new
      if (!tempRect) {
        // 创建矩形对象
        tempRect = new Rect({
          left: startX,
          top: startY,
          width: 0,
          height: 0,
          subTargetCheck: true,
          borderColor: "#7BD91F", // 控制边框颜色
          cornerColor: "#7BD91F", // 控制点的颜色
          fill: "rgba(123, 217, 31,0.05)",
          stroke: "#7BD91F",
          selectable: false,
          hasBorders: false,
          evented: false,
          strokeWidth: 1 / currentZoom.value, //  描边宽度
          cornerStrokeWidth: 1 / currentZoom.value, // 控制点边框的宽度
          strokeUniform: true, // 确保缩放时描边宽度不变
          objectCaching: false, // 避免重复缓存导致性能差
        });
        fCanvas.add(tempRect);
        tempRect.setCoords();
        fCanvas.requestRenderAll();
      } else {
        tempRect.set({ left: startX, top: startY });
        tempRect.setCoords();
        fCanvas.requestRenderAll();
      }
    } else if (!editing && e.ctrlKey) {
      // 鼠标按下开始平移
      isPanning = true;
      // 禁止选择
      fCanvas.selection = false;
      // 记录上次位置
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

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

    if (!drawingPolygon.value || currentPolygonPoints.length < 2) return;

    const pointer = fCanvas.getPointer(opt.e);

    // 移除上一次临时预览
    if (tempPolygonPreview) {
      fCanvas.remove(tempPolygonPreview);
    }

    // 创建临时多边形，包含当前鼠标位置
    const previewPoints = [
      ...currentPolygonPoints,
      { x: pointer.x, y: pointer.y },
    ];
    tempPolygonPreview = new Polygon(previewPoints, {
      fill: "rgba(255, 94, 0, 0.2)",
      stroke: "#FF5E00",
      selectable: false,
      evented: false,
      strokeWidth: 1 / currentZoom.value,
    });

    fCanvas.add(tempPolygonPreview);
    fCanvas.renderAll();
  }); // 例如每16ms执行一次
  // 监听鼠标移动事件
  // fCanvas.on("mouse:move", (opt) => {
  //   const pointerA: any = fCanvas.getPointer(opt.e);
  //   console.log(pointerA.x, pointerA.y);
  //   const e = opt.e as MouseEvent;
  //   startPos.x = e.clientX;
  //   startPos.y = e.clientY;
  //   // 绘制中
  //   if (drawing && tempRect) {
  //     // 获取鼠标位置
  //     const p = fCanvas.getPointer(e);
  //     // 设置矩形的宽高和位置
  //     tempRect.set({
  //       width: Math.abs(p.x - startX),
  //       height: Math.abs(p.y - startY),
  //       left: p.x < startX ? p.x : startX,
  //       top: p.y < startY ? p.y : startY,
  //     });
  //     // 设置矩形的坐标
  //     tempRect.setCoords();
  //     // 请求重新渲染
  //     fCanvas.requestRenderAll();
  //     // fCanvas.renderAll();
  //   } else if (isPanning) {
  //     // 拖拽中
  //     fCanvas.relativePan(new Point(e.clientX - lastX, e.clientY - lastY));
  //     // 记录最后位置
  //     lastX = e.clientX;
  //     lastY = e.clientY;
  //   }

  //   if (!drawingPolygon.value || currentPolygonPoints.length < 2) return;

  //   const pointer = fCanvas.getPointer(opt.e);

  //   // 移除上一次临时预览
  //   if (tempPolygonPreview) {
  //     fCanvas.remove(tempPolygonPreview);
  //   }

  //   // 创建临时多边形，包含当前鼠标位置
  //   const previewPoints = [
  //     ...currentPolygonPoints,
  //     { x: pointer.x, y: pointer.y },
  //   ];
  //   tempPolygonPreview = new Polygon(previewPoints, {
  //     fill: "rgba(255, 94, 0, 0.2)",
  //     stroke: "#FF5E00",
  //     selectable: false,
  //     evented: false,
  //     strokeWidth: 1,
  //   });

  //   fCanvas.add(tempPolygonPreview);
  //   console.log("我被执行了~~~~~~~~");
  //   fCanvas.renderAll();
  // });

  // 监听鼠标抬起事件
  fCanvas.on("mouse:up", (opt) => {
    console.log("mouse:up");
    const e = opt.e as MouseEvent;
    startPos.x = e.clientX;
    startPos.y = e.clientY;
    if (drawing && tempRect) {
      // 允许选择对象
      fCanvas.selection = true;
      drawing = false;
      // 创建标签编辑器
      console.log("创建标签编辑器", tempRect);
      promptLabelEditor(tempRect);
      // 鼠标光标样式默认
      fCanvas.defaultCursor = "default";
      fCanvas.forEachObject((o) => {
        if (o.type === "rect" || o.type === "group" || o.type === "polygon") {
          o.selectable = true;
          o.evented = true;
        }
      });

      // 创建标签编辑器
      isCrosshair.value = false;
      fCanvas.renderAll();
    } else if (isPanning) {
      // 停止平移
      isPanning = false;
      // 允许选择对象
      fCanvas.selection = true;
    }
  });

  // 1. 阻止 Ctrl + 滚轮 触发页面缩放
  // document.addEventListener(
  //   "wheel",
  //   (e) => {
  //     if (e.ctrlKey) {
  //       e.preventDefault();
  //     }
  //   },
  //   { passive: false }
  // );

  // // 2. Fabric.js 缩放逻辑
  // // 限制最大缩放
  // const MAX_ZOOM = 10;
  // const MIN_ZOOM = 0.1;

  // fCanvas.on(
  //   "mouse:wheel",
  //   throttle(function (opt) {
  //     const e = opt.e;
  //     if (!e.ctrlKey) return;
  //     e.preventDefault();

  //     // 清理临时对象
  //     cleanupTempObjects();

  //     const delta = e.deltaY;
  //     const currentZoom = fCanvas.getZoom();
  //     const factor = delta > 0 ? 0.7 : 1.3;
  //     const newZoom = Math.max(
  //       MIN_ZOOM,
  //       Math.min(currentZoom * factor, MAX_ZOOM)
  //     );

  //     scaleCoutent.value = newZoom;

  //     // 缩放
  //     fCanvas.zoomToPoint(new Point(e.offsetX, e.offsetY), newZoom);

  //     // 优化文本：只改 scale，不改 fontSize
  //     fCanvas.getObjects("textbox").forEach((tb) => {
  //       tb.set({
  //         scaleX: 1 / newZoom,
  //         scaleY: 1 / newZoom,
  //         dirty: true, // 强制重绘
  //       });
  //       tb.setCoords();
  //     });

  //     // 使用 requestRenderAll（Fabric 内部已节流）
  //     fCanvas.requestRenderAll();
  //   }, 100)
  // ); // 降低节流频率，提升缩放流畅度

  // 清理临时对象
  function cleanupTempObjects() {
    if (tempRect) {
      fCanvas.remove(tempRect);
      tempRect = null;
    }
    if (tempPolygonPreview) {
      fCanvas.remove(tempPolygonPreview);
      tempPolygonPreview = null;
    }
  }
  // 监听鼠标滚轮事件且与ctrl配合使用才会生效
  // fCanvas.on(
  //   "mouse:wheel",
  //   throttle(function (opt) {
  //     const e = opt.e as WheelEvent;

  //     if (!e.ctrlKey) return;
  //     e.preventDefault();

  //     const delta = e.deltaY;
  //     const zoom = fCanvas.getZoom();
  //     const factor = delta > 0 ? 0.9 : 1.1; // 每次变化 10%
  //     let newZoom = zoom * factor;

  //     newZoom = Math.max(0.1, Math.min(newZoom, 20));

  //     scaleCoutent.value = newZoom;
  //     fCanvas.zoomToPoint(new Point(e.offsetX, e.offsetY), newZoom);

  //     // 调整文字大小（可选：也可随缩放变化）
  //     fCanvas.getObjects("textbox").forEach((tb) => {
  //       tb.set("fontSize", 12 / newZoom); // 可选：让文字不随缩放变大变小
  //     });

  //     fCanvas.renderAll();
  //   }, 16)
  // );

  fCanvas.on("mouse:wheel", (opt) => {
    const e = opt.e as WheelEvent;

    if (!e.ctrlKey) return;
    e.preventDefault();

    const delta = e.deltaY;
    const zoom = fCanvas.getZoom();
    const factor = delta > 0 ? 0.9 : 1.1; // 每次变化 10%
    let newZoom = zoom * factor;

    newZoom = Math.max(0.1, Math.min(newZoom, 10));

    scaleCoutent.value = newZoom;
    fCanvas.zoomToPoint(new Point(e.offsetX, e.offsetY), newZoom);

    // 调整文字大小（可选：也可随缩放变化）
    fCanvas.getObjects("textbox").forEach((tb) => {
      tb.set("fontSize", 12 / newZoom); // 可选：让文字不随缩放变大变小
    });

    fCanvas.renderAll();
  });

  // 防抖函数
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const debounceUpdateTextSize = debounce((zoom) => {
    fCanvas.getObjects("textbox").forEach((tb) => {
      tb.set("fontSize", 12 / zoom);
    });
    fCanvas.requestRenderAll();
  }, 100);

  // fCanvas.on("mouse:wheel", (opt) => {
  //   // 如果没有处于拖拽状态，则直接返回
  //   const e = opt.e as WheelEvent;
  //   // 如果按下Ctrl键，则开始平移 && !drawing && !editing
  //   if (e.ctrlKey) {
  //     e.preventDefault();
  //     // 获取鼠标滚轮滚动的量
  //     const delta = e.deltaY > 0 ? -0.15 : 0.15;
  //     // 获取当前缩放比例
  //     let zoom = fCanvas.getZoom();
  //     // 设置新的缩放比例
  //     zoom = Math.max(0.1, Math.min(zoom + delta * zoom, 40));
  //     // 调整画布缩放比例
  //     scaleCoutent.value = zoom;
  //     fCanvas.zoomToPoint(new Point(e.offsetX, e.offsetY), zoom);
  //     // 调整标签文字大小
  //     fCanvas.getObjects("textbox").forEach((tb) => {
  //       tb.set("fontSize", 12);
  //     });
  //   }
  // });
}
function addTempCircle(point: any) {
  const circle = new Circle({
    left: point.x,
    top: point.y,
    radius: 5 / currentZoom.value,
    fill: "red",
    selectable: false,
    originX: "center",
    strokeUniform: true, // 确保缩放时描边宽度不变
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
    // strokeWidth: 1,

    strokeWidth: 1 / currentZoom.value, //  描边宽度
    cornerStrokeWidth: 1 / currentZoom.value, // 控制点边框的宽度
    selectable: false,
    strokeUniform: true, // 确保缩放时描边宽度不变
  });
  fCanvas.add(line);
  tempLinePoints.push(line);
}

function distance(p1: any, p2: any) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function reloadCanvas() {
  // 先清理再重新初始化
  if (fCanvas) {
    fCanvas.dispose(); // 完全销毁画布
  }
  initFabricCanvas();
  // initFabricCanvas(); // 初始化 Fabric.js 画布
  const data = imageLabelData[currentIndex.value];
  // 1. 清空 canvas
  fCanvas.clear();
  loadImage(data.imgurl); // 加载指定 URL 的图片
  setupEventListeners(); // 设置时间监听器
}
// 放大
function zoomIn() {
  const zoom = fCanvas.getZoom();
  const newZoom = Math.min(zoom * 1.1, 40); // 限制最大倍数
  fCanvas.zoomToPoint(
    new Point(fCanvas.getWidth() / 2, fCanvas.getHeight() / 2),
    newZoom
  );
  fCanvas.requestRenderAll();
}

// 缩小
function zoomOut() {
  const zoom = fCanvas.getZoom();
  const newZoom = Math.max(zoom * 0.9, 0.1); // 限制最小倍数
  scaleCoutent.value = newZoom;
  fCanvas.zoomToPoint(
    new Point(fCanvas.getWidth() / 2, fCanvas.getHeight() / 2),
    newZoom
  );
  fCanvas.requestRenderAll();
}

// 还原
function resetZoom() {
  fCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // 重置缩放和平移
  fCanvas.setZoom(1); // 清空缩放比例
  fCanvas.requestRenderAll();
}
// 右下角文件列表切换也米娜
function changeImg(index: any) {
  // 先清理资源
  cleanupResources();
  currentIndex.value = index;
  drawingPolygon.value = false;
  reloadCanvas();
  // 7. 清除绘制时遗留的临时点/线
  clearTempDraw();
  currentPolygonPoints = [];
}
// 下一张图片
function nextImage() {
  if (currentIndex.value < imageLabelData.length - 1) {
    currentIndex.value++;
  } else {
    ElMessage.warning("这已经是最后一张了亲");
    return;
  }
  drawingPolygon.value = false;
  reloadCanvas();
  // 7. 清除绘制时遗留的临时点/线
  clearTempDraw();
  currentPolygonPoints = [];
}
// 上一张图片
function prevImage() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    ElMessage.warning("这已经是第一张了亲");
    return;
  }
  drawingPolygon.value = false;
  reloadCanvas();
  // 7. 清除绘制时遗留的临时点/线
  clearTempDraw();
  currentPolygonPoints = [];
}
// 创建矩形
function createRectangles() {
  if (drawingPolygon.value) {
    ElMessage({
      message: "请先取消多边形创建模式!",
      type: "warning",
    });
    return;
  }
  // drawing = true;
  // // editing = true;
  // fCanvas.selection = false;
  // fCanvas.defaultCursor = "crosshair";
  // fCanvas.forEachObject((o) => {
  //   console.log("o.type", o.type);
  //   if (o.type === "rect" || o.type === "group" || o.type === "polygon") {
  //     o.selectable = false;
  //     o.evented = false;
  //   }
  // });
  // 禁止选择
  if (!drawing && !editing) {
    // 禁止选择
    fCanvas.selection = false;
    fCanvas.defaultCursor = "crosshair";
    fCanvas.forEachObject((o) => {
      o.selectable = false;
      o.evented = false;
    });
    drawing = true;
  }
}
function clearTempDraw() {
  currentPolygonPoints = [];
  tempCirclePoints.forEach((c) => fCanvas.remove(c));
  tempLinePoints.forEach((l) => fCanvas.remove(l));
  tempCirclePoints = [];
  tempLinePoints = [];
  tempCirclePoints.forEach((c) => fCanvas.remove(c));
  tempLinePoints.forEach((l) => fCanvas.remove(l));
  if (tempPolygonPreview) {
    fCanvas.remove(tempPolygonPreview);
    tempPolygonPreview = null;
  }
  tempCirclePoints = [];
  tempLinePoints = [];
  currentPolygonPoints = [];
}
// 创建多边形
function createPolygon() {
  currentPolygonPoints = [];
  clearTempDraw(); // 退出绘制时清除所有临时点
  drawingPolygon.value = !drawingPolygon.value;
  if (!drawingPolygon.value) {
    clearTempDraw(); // 退出绘制时清除所有临时点
  }
}
// 导出数据
function exportData() {
  const zoom = fCanvas.getZoom();
  console.log("导出对应原图像素的标签数据：", JSON.stringify(imageLabelData));
}

// 当前组件挂载的时候执行
onMounted(async () => {
  cleanupResources();
  for (let i = 1; i <= 57; i++) {
    imageLabelData.push({
      imgurl: `http://192.168.80.32:8889/1 (${i}).jpg`,
      labelInfo: [] as LabelInfo[],
      labelPolygonInfo: [],
    });
  }
  await nextTick(); // 确保 DOM 和响应式更新完成（可选）
  const data = imageLabelData[currentIndex.value];
  initFabricCanvas(); // 初始化 Fabric.js 画布
  loadImage(data.imgurl); // 加载指定 URL 的图片
  setupEventListeners(); // 设置时间监听器
});
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  user-select: none;
}
.labelImg {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  .left-menu {
    position: absolute;
    left: 0;
    height: 100%;
    width: 122px;
    padding-top: 5px;
    background: #f0f0f0;
    position: relative; /* 确保伪元素相对于这个元素定位 */
    .menu-item {
      width: 100;
      height: 60px;
      margin-bottom: 10px;
    }
    .menu-item-icon0 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/文件夹.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon1 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/保存.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon2 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/箭头.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon3 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/箭头.png") no-repeat;
      background-size: 80% 100%;
      margin-left: 24px;
      transform: scaleX(-1);
    }
    .menu-item-icon4 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/框选.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon5 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/放大.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon6 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/缩小.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon7 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/fit-window.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon8 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/导出数据.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon10 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/复制.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon11 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/粘贴.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-icon9 {
      margin: 0px auto;
      width: 50px;
      height: 40px;
      background: url("../../assets/image/多边形选框.png") no-repeat;
      background-size: 80% 100%;
    }
    .menu-item-text {
      text-align: center;
      width: 100;
      margin-left: -12px;
      margin-top: 2px;
    }
    .menu-item:hover {
      background: #e5f3ff;
    }
  }
  .left-menu::after {
    content: ""; /* 必须有内容才能显示 */
    position: absolute; /* 绝对定位 */
    top: 0; /* 顶部对齐 */
    right: 0; /* 右侧对齐 */
    bottom: 0; /* 底部对齐 */
    width: 2px; /* 宽度 */
    background-color: #828790; /* 颜色 */
  }
  .canvas-box {
    position: absolute;
    left: 122px;
    right: 230px;
    top: 0;
    bottom: 0;
    overflow: hidden;
    .imageView {
      background: #e8e8e8;

      // background: #000000;
    }
  }
  .right-list {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 230px;
    background: #f0f0f0;
    .right-label-list {
      height: 24px;
      line-height: 24px;
      width: 99%;
      border: 1px solid #b9b9b9;
      margin: 2px;
      color: 12px;
      background: #dadada;
      margin-bottom: 2px;
      font-size: 12px;
    }
    .right-label-list-content {
      height: 350px;
      width: 98%;
      margin-left: 4px;
      background: #fff;
      border: 1px solid #828790;
    }
    .right-file-list {
      height: 24px;
      line-height: 24px;
      width: 99%;
      border: 1px solid #b9b9b9;
      margin: 2px;
      color: 12px;
      background: #dadada;
      margin-bottom: 2px;
      font-size: 12px;
    }
    .right-file-list-content {
      width: 98%;
      margin-left: 4px;
      background: #fff;
      position: absolute;
      top: 406px;
      bottom: 0;
      border: 1px solid #828790;
    }
  }

  .right-list::after {
    content: ""; /* 必须有内容才能显示 */
    position: absolute; /* 绝对定位 */
    top: 0; /* 顶部对齐 */
    left: 0; /* 右侧对齐 */
    bottom: 0; /* 底部对齐 */
    width: 2px; /* 宽度 */
    background-color: #828790; /* 颜色 */
  }
}
.label-item {
  width: 100%;
  height: 20px;
  cursor: pointer;
}
.label-item-active {
  background-color: yellow !important;
}
.img-List-item {
  // width: 100%;
  height: 100%;
  overflow: auto;
  overflow-y: scroll;
  overflow-x: scroll;
  font-size: 12px;
}
</style>
