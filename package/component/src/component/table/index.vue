<script lang="ts">
export default {
  name: "LayTable",
};
</script>

<script setup lang="ts">
import "./index.less";
import {
  ref,
  watch,
  useSlots,
  withDefaults,
  onMounted,
  StyleValue,
  WritableComputedRef,
  computed,
} from "vue";
import { v4 as uuidv4 } from "../../utils/guidUtil";
import { Recordable } from "../../types";
import { LayIcon } from "@layui/icons-vue";
import LayCheckbox from "../checkbox/index.vue";
import LayDropdown from "../dropdown/index.vue";
import LayPage from "../page/index.vue";
import LayEmpty from "../empty/index.vue";
import TableRow from "./TableRow.vue";

export interface LayTableProps {
  id?: string;
  skin?: string;
  size?: string;
  page?: Recordable;
  columns: Recordable[];
  dataSource: Recordable[];
  defaultToolbar?: boolean;
  selectedKey?: any;
  selectedKeys?: Recordable[];
  indentSize?: number;
  childrenColumnName?: string;
  height?: number;
  maxHeight?: string;
  even?: boolean;
  expandIndex?: number;
  rowClassName?: string | Function;
  cellClassName?: string | Function;
  rowStyle?: string | Function;
  cellStyle?: string | Function;
}

const props = withDefaults(defineProps<LayTableProps>(), {
  id: "id",
  size: "md",
  indentSize: 30,
  childrenColumnName: "children",
  dataSource: () => [],
  selectedKeys: () => [],
  maxHeight: "auto",
  even: false,
  rowClassName: "",
  cellClassName: "",
  expandIndex: 0,
  rowStyle: "",
  cellStyle: "",
});

const tableId = uuidv4();

const emit = defineEmits([
  "change",
  "update:selectedKeys",
  "update:selectedKey",
  "row-contextmenu",
  "row-double",
  "row",
]);

const slot = useSlots();
const slots = slot.default && slot.default();

const allChecked = ref(false);
const hasChecked = ref(false);
const tableDataSource = ref<any[]>([...props.dataSource]);
const tableSelectedKeys = ref<Recordable[]>([...props.selectedKeys]);
const tableColumns = ref([...props.columns]);
const tableColumnKeys = ref(
  props.columns.map((item: any) => {
    if (item.hide != true) {
      return item.key;
    }
  })
);

const tableSelectedKey: WritableComputedRef<Recordable[]> = computed({
  get() {
    return props.selectedKey;
  },
  set(val) {
    emit("update:selectedKey", val);
  },
});

watch(
  () => props.dataSource,
  () => {
    tableDataSource.value = [...props.dataSource];
  },
  { deep: true }
);

const changeAll = function (checked: any) {
  const ids = props.dataSource.map((item: any) => {
    return item[props.id];
  });
  let arr = [...tableSelectedKeys.value];
  arr.splice(0, ids.length);
  if (checked) {
    ids.forEach((id) => {
      arr.push(id);
    });
  }
  tableSelectedKeys.value = arr;
};

watch(
  tableSelectedKeys,
  () => {
    if (tableSelectedKeys.value.length === props.dataSource.length) {
      allChecked.value = true;
    } else {
      allChecked.value = false;
    }
    if (tableSelectedKeys.value.length > 0) {
      hasChecked.value = true;
    } else {
      hasChecked.value = false;
    }
    emit("update:selectedKeys", tableSelectedKeys.value);
  },
  { deep: true, immediate: true }
);

const change = function (page: any) {
  emit("change", page);
};

const rowClick = function (data: any, evt: MouseEvent) {
  emit("row", data, evt);
};

const rowDoubleClick = function (data: any, evt: MouseEvent) {
  emit("row-double", data, evt);
};

const rowContextmenu = function (data: any, evt: MouseEvent) {
  emit("row-contextmenu", data, evt);
};

const print = function () {
  let subOutputRankPrint = document.getElementById(tableId) as HTMLElement;
  let newContent = subOutputRankPrint.innerHTML;
  let oldContent = document.body.innerHTML;
  document.body.innerHTML = newContent;
  window.print();
  window.location.reload();
  document.body.innerHTML = oldContent;
};

const exportData = () => {
  const head: any = [];
  const body: any = [];
  tableColumns.value.forEach((item) => {
    try {
      tableDataSource.value.forEach((dataItem) => {
        if (dataItem[item.key] != undefined) {
          head.push(item.title);
          throw new Error("exception");
        }
      });
    } catch (e) {}
  });
  tableDataSource.value.forEach((item) => {
    let obj: any = [];
    tableColumns.value.forEach((tableColumn) => {
      Object.keys(item).forEach((name) => {
        if (tableColumn.key === name) {
          obj.push(item[name]);
        }
      });
    });
    body.push(obj);
  });
  exportToExcel(head, body);
  return;
};

function exportToExcel(headerList: any, bodyList: any) {
  let excelList = [];
  excelList.push(headerList.join("\t,"));
  excelList.push("\n");
  bodyList.forEach((item: any) => {
    excelList.push(item.join("\t,"));
    excelList.push("\n");
  });
  var merged = excelList.join("");
  let link = document.createElement("a");
  link.href = "data:text/xls;charset=utf-8,\ufeff" + encodeURIComponent(merged);
  link.download = `table.xls`;
  link.click();
}

const sortTable = (e: any, key: string, sort: string) => {
  let currentSort = e.target.parentNode.getAttribute("lay-sort");
  if (sort === "desc") {
    if (currentSort === sort) {
      e.target.parentNode.setAttribute("lay-sort", "");
      tableDataSource.value = [...props.dataSource];
    } else {
      e.target.parentNode.setAttribute("lay-sort", "desc");
      tableDataSource.value.sort((x, y) => {
        if (x[key] < y[key]) return 1;
        else if (x[key] > y[key]) return -1;
        else return 0;
      });
    }
  } else {
    if (currentSort === sort) {
      e.target.parentNode.setAttribute("lay-sort", "");
      tableDataSource.value = [...props.dataSource];
    } else {
      e.target.parentNode.setAttribute("lay-sort", "asc");
      tableDataSource.value.sort((x, y) => {
        if (x[key] < y[key]) return -1;
        else if (x[key] > y[key]) return 1;
        else return 0;
      });
    }
  }
};

let tableHeader = ref<HTMLElement | null>(null);
let tableBody = ref<HTMLElement | null>(null);
let scrollWidthCell = ref(0);

const getScrollWidth = () => {
  const clientWidth: number = tableBody.value?.clientWidth || 0;
  const offsetWidth: number = tableBody.value?.offsetWidth || 0;

  if (clientWidth < offsetWidth) {
    scrollWidthCell.value = offsetWidth - clientWidth;
  }
};

const hasl = ref(false);
const hasr = ref(false);

const classes = computed(() => {
  return [
    hasl.value ? "layui-table-has-fixed-left" : "",
    hasr.value ? "layui-table-has-fixed-right" : "",
  ];
});

onMounted(() => {
  getScrollWidth();
  getFixedColumn();
  tableBody.value?.addEventListener("scroll", () => {
    getFixedColumn();
  });
  window.onresize = () => {
    getFixedColumn();
  };
});

const getFixedColumn = () => {
  tableHeader.value!.scrollLeft = tableBody.value?.scrollLeft || 0;
  // @ts-ignore
  if (tableBody.value?.scrollWidth > tableBody.value?.clientWidth) {
    if (tableBody.value?.scrollLeft == 0) {
      hasl.value = false;
      hasr.value = true;
    } else {
      // @ts-ignore
      if (
        tableBody.value?.scrollLeft + tableBody.value?.offsetWidth + 2 >
        tableBody.value?.scrollWidth
      ) {
        hasl.value = true;
        hasr.value = false;
      } else {
        hasl.value = true;
        hasr.value = true;
      }
    }
  } else {
    hasl.value = false;
    hasr.value = false;
  }
};

const slotsData = ref<string[]>([]);

props.columns.map((value: any) => {
  if (value.customSlot) {
    slotsData.value.push(value.customSlot);
  }
});

const currentIndentSize = ref(0);
const childrenExpandSpace = ref(false);

props.dataSource.map((value: any) => {
  if (value[props.childrenColumnName]) {
    childrenExpandSpace.value = true;
  }
});

const renderFixedStyle = (column: any, columnIndex: number) => {
  if (column.fixed) {
    if (column.fixed == "left") {
      var left = 0;
      for (var i = 0; i < columnIndex; i++) {
        if (props.columns[i].fixed && props.columns[i].fixed == "left") {
          left = left + props.columns[i]?.width.replace("px", "");
        }
      }
      return { left: `${left}px` } as StyleValue;
    } else {
      var right = 0;
      for (var i = columnIndex + 1; i < props.columns.length; i++) {
        if (props.columns[i].fixed && props.columns[i].fixed == "right") {
          right = right + props.columns[i]?.width.replace("px", "");
        }
      }
      return { right: `${right}px` } as StyleValue;
    }
  } else {
    var isLast = true;
    for (var i = columnIndex + 1; i < props.columns.length; i++) {
      if (props.columns[i].fixed == undefined) {
        isLast = false;
      }
    }
    return isLast ? ({ "border-right": "none" } as StyleValue) : {};
  }
  return {} as StyleValue;
};

const renderFixedClassName = (column: any, columnIndex: number) => {
  if (column.fixed) {
    if (column.fixed == "left") {
      var left = true;
      for (var i = columnIndex + 1; i < props.columns.length; i++) {
        if (props.columns[i].fixed && props.columns[i].fixed == "left") {
          left = false;
        }
      }
      return left ? `layui-table-fixed-left-last` : "";
    } else {
      var right = true;
      for (var i = 0; i < columnIndex; i++) {
        if (props.columns[i].fixed && props.columns[i].fixed == "right") {
          right = false;
        }
      }
      return right ? `layui-table-fixed-right-first` : "";
    }
  }
};

const hasTotalRow = computed(() => {
  let b = false;
  props.columns.forEach((item) => {
    if (item.totalRow) {
      b = true;
    }
  });
  return b;
});

const renderTotalRowCell = (column: any) => {
  if (column.totalRow) {
    if (column.totalRow != true) {
      return column.totalRow;
    } else {
      let total = 0;
      tableDataSource.value.forEach((item) => {
        total = total + Number(item[column.key]);
      });
      return total;
    }
  }
};
</script>

<template>
  <div :id="tableId">
    <table class="layui-hide" lay-filter="test"></table>
    <div class="layui-form layui-border-box layui-table-view" :class="classes">
      <!-- 工具栏 -->
      <div v-if="defaultToolbar || slot.toolbar" class="layui-table-tool">
        <div v-if="slot.toolbar" class="layui-table-tool-temp">
          <slot name="toolbar"></slot>
        </div>
        <div v-if="defaultToolbar" class="layui-table-tool-self">
          <lay-dropdown>
            <div class="layui-inline" title="筛选列" lay-event="LAYTABLE_PRINT">
              <i class="layui-icon layui-icon-cols"></i>
            </div>
            <template #content>
              <div class="layui-table-tool-checkbox">
                <lay-checkbox
                  v-for="column in columns"
                  v-model="tableColumnKeys"
                  skin="primary"
                  :key="column.key"
                  :value="column.key"
                  >{{ column.title }}</lay-checkbox
                >
              </div>
            </template>
          </lay-dropdown>
          <div
            class="layui-inline"
            title="导出"
            lay-event="LAYTABLE_PRINT"
            @click="exportData()"
          >
            <i class="layui-icon layui-icon-export"></i>
          </div>
          <div
            class="layui-inline"
            title="打印"
            lay-event="LAYTABLE_PRINT"
            @click="print()"
          >
            <i class="layui-icon layui-icon-print"></i>
          </div>
        </div>
      </div>

      <div class="layui-table-box">
        <!-- 表头 -->
        <div
          class="layui-table-header"
          :style="[{ 'padding-right': `${scrollWidthCell}px` }]"
        >
          <div class="layui-table-header-wrapper" ref="tableHeader">
            <table class="layui-table" :lay-size="size" :lay-skin="skin">
              <colgroup>
                <template v-for="column in columns" :key="column">
                  <template v-if="tableColumnKeys.includes(column.key)">
                    <col
                      :width="column.width"
                      :style="{
                        minWidth: column.minWidth ? column.minWidth : '50px',
                      }"
                    />
                  </template>
                </template>
              </colgroup>
              <thead>
                <tr>
                  <template
                    v-for="(column, columnIndex) in columns"
                    :key="column"
                  >
                    <th
                      v-if="tableColumnKeys.includes(column.key)"
                      class="layui-table-cell"
                      :class="[
                        renderFixedClassName(column, columnIndex),
                        column.fixed ? `layui-table-fixed-${column.fixed}` : '',
                        column.type == 'checkbox'
                          ? 'layui-table-cell-checkbox'
                          : '',
                        column.type == 'radio' ? 'layui-table-cell-radio' : '',
                        column.type == 'number'
                          ? 'layui-table-cell-number'
                          : '',
                      ]"
                      :style="[
                        {
                          textAlign: column.align,
                        },
                        renderFixedStyle(column, columnIndex),
                      ]"
                    >
                      <template v-if="column.type == 'checkbox'">
                        <lay-checkbox
                          v-model="hasChecked"
                          :is-indeterminate="!allChecked"
                          skin="primary"
                          value="all"
                          @change="changeAll"
                        />
                      </template>
                      <template v-else>
                        <span>
                          <template v-if="column.titleSlot">
                            <slot :name="column.titleSlot"></slot>
                          </template>
                          <template v-else>
                            {{ column.title }}
                          </template>
                        </span>
                        <!-- 插槽 -->
                        <span
                          v-if="column.sort"
                          class="layui-table-sort layui-inline"
                          lay-sort
                        >
                          <i
                            @click.stop="sortTable($event, column.key, 'asc')"
                            class="layui-edge layui-table-sort-asc"
                            title="升序"
                          ></i>
                          <i
                            @click.stop="sortTable($event, column.key, 'desc')"
                            class="layui-edge layui-table-sort-desc"
                            title="降序"
                          ></i>
                        </span>
                      </template>
                    </th>
                  </template>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <!-- 表身 -->
        <div
          class="layui-table-body layui-table-main"
          :style="{ height: height, maxHeight: maxHeight }"
          ref="tableBody"
        >
          <table
            v-if="tableDataSource.length > 0"
            class="layui-table"
            :class="{ 'layui-table-even': props.even }"
            :lay-size="size"
            :lay-skin="skin"
          >
            <colgroup>
              <template
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
              >
                <template v-if="tableColumnKeys.includes(column.key)">
                  <col
                    :width="column.width"
                    :style="{
                      minWidth: column.minWidth ? column.minWidth : '50px',
                    }"
                  />
                </template>
              </template>
            </colgroup>
            <tbody>
              <!-- 渲染 -->
              <template v-for="(data, index) in tableDataSource" :key="index">
                <table-row
                  :id="id"
                  :index="index"
                  :data="data"
                  :columns="columns"
                  :indent-size="indentSize"
                  :currentIndentSize="currentIndentSize"
                  :tableColumnKeys="tableColumnKeys"
                  :expandSpace="childrenExpandSpace"
                  :expandIndex="expandIndex"
                  :cellStyle="cellStyle"
                  :cellClassName="cellClassName"
                  :rowStyle="rowStyle"
                  :rowClassName="rowClassName"
                  @row="rowClick"
                  @row-double="rowDoubleClick"
                  @row-contextmenu="rowContextmenu"
                  v-model:selectedKeys="tableSelectedKeys"
                  v-model:selectedKey="tableSelectedKey"
                >
                  <template v-for="name in slotsData" #[name]="{ data }">
                    <slot :name="name" :data="data"></slot>
                  </template>
                  <template v-if="slot.expand" #expand="{ data }">
                    <slot name="expand" :data="data"></slot>
                  </template>
                </table-row>
              </template>
              <tr v-if="hasTotalRow" class="layui-table-total">
                <template
                  v-for="(column, columnIndex) in columns"
                  :key="columnIndex"
                >
                  <template v-if="tableColumnKeys.includes(column.key)">
                    <td>{{ renderTotalRowCell(column) }}</td>
                  </template>
                </template>
              </tr>
            </tbody>
          </table>
          <lay-empty v-else></lay-empty>
        </div>
      </div>
      <div v-if="page" class="layui-table-page">
        <lay-page
          show-page
          show-skip
          show-limit
          :total="page.total"
          :limit="page.limit"
          v-model="page.current"
          @jump="change"
        >
          <template #prev>
            <lay-icon type="layui-icon-left" />
          </template>
          <template #next>
            <lay-icon type="layui-icon-right" />
          </template>
        </lay-page>
      </div>
    </div>
  </div>
</template>
