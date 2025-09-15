 <template>
  <el-main class="layout-main">
    <!-- 右侧主区域 -->
    <el-scrollbar>
      <div class="layout-main-warp">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <!-- <keep-alive> -->
            <keep-alive :include="cacheRouteNames">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </el-scrollbar>
  </el-main>
</template>
<script setup lang="ts" name="LayoutMain">
const cacheRouteNames = ["home", "config", "login"];
</script>
<style scoped lang="scss">
:deep(.el-scrollbar__view) {
  /* 铺满高度 */
  height: 100%;
}
</style>
