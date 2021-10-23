import type { App } from 'vue'
import type { IDefineComponent, InstallOptions } from './module/type/index'

import './css/layui.css'
import './css/layer.css'
import LayAvatar from './module/avatar/index'
import LayRadio from './module/radio/index'
import LayButton from './module/button/index'
import LayButtonContainer from './module/buttonContainer/index'
import LayButtonGroup from './module/buttonGroup/index'
import LayIcon from './module/icon/index'
import LayIconPicker from './module/iconPicker/index'
import LayCard from './module/card/index'
import LayLayout from './module/layout/index'
import LaySide from './module/side/index'
import LayBody from './module/body/index'
import LayHeader from './module/header/index'
import LayFooter from './module/footer/index'
import LayLogo from './module/logo/index'
import LayPanel from './module/panel/index'
import LayProgress from './module/progress/index'
import LayCol from './module/col/index'
import LayRow from './module/row/index'
import LayInput from './module/input/index'
import LayBadge from './module/badge/index'
import LayBlock from './module/block/index'
import LayLine from './module/line/index'
import LayTimeline from './module/timeline/index'
import LayTimelineItem from './module/timelineItem/index'
import LayTextarea from './module/textarea/index'
import LaySwitch from './module/switch/index'
import LayCollapse from './module/collapse/index'
import LayCollapseItem from './module/collapseItem/index'
import LayContainer from './module/container/index'
import LayMenu from './module/menu/index'
import LayMenuItem from './module/menuItem/index'
import LayMenuChildItem from './module/menuChildItem/index'
import LayCheckbox from './module/checkbox/index'
import LayForm from './module/form/index'
import LayBreadcrumb from './module/breadcrumb/index'
import LayBreadcrumbItem from './module/breadcrumbItem/index'
import LayField from './module/field/index'
import LaySelect from './module/select/index'
import LaySelectOption from './module/selectOption/index'
import LayScroll from './module/scroll/index'
import LayEmpty from './module/empty/index'
import LayFormItem from './module/formItem/index'
import LayRate from './module/rate/index'
import LayDropdown from './module/dropdown/index'
import LayDropdownItem from './module/dropdownItem/index'
import LayTab from './module/tab/index'
import LayTabItem from './module/tabItem/index'
import LayTree from './module/tree/index'
import LayTable from './module/table/index'
import LayPage from './module/page/index'
import LayTransfer from './module/transfer/index'
import LayCheckboxGroup from './module/checkboxGroup/index'
import LaySlider from './module/slider/index'
import LayCarousel from './module/carousel/index'
import LayCarouselItem from './module/carouselItem/index'
import LayColorPicker from './module/colorPicker/index'

const components: Record<string, IDefineComponent> = {
  LayRadio,
  LayButton,
  LayIcon,
  LayLayout,
  LaySide,
  LayHeader,
  LayBody,
  LayFooter,
  LayLogo,
  LayPanel,
  LayCard,
  LayProgress,
  LayButtonGroup,
  LayButtonContainer,
  LayRow,
  LayCol,
  LayInput,
  LayBadge,
  LayBlock,
  LayLine,
  LayTimeline,
  LayTimelineItem,
  LayTextarea,
  LaySwitch,
  LayCollapse,
  LayCollapseItem,
  LayContainer,
  LayMenu,
  LayMenuItem,
  LayMenuChildItem,
  LayCheckbox,
  LayForm,
  LayBreadcrumb,
  LayBreadcrumbItem,
  LayAvatar,
  LayField,
  LaySelect,
  LayScroll,
  LaySelectOption,
  LayEmpty,
  LayFormItem,
  LayRate,
  LayDropdown,
  LayDropdownItem,
  LayTab,
  LayTabItem,
  LayIconPicker,
  LayTree,
  LayTable,
  LayPage,
  LayTransfer,
  LayCheckboxGroup,
  LaySlider,
  LayCarousel,
  LayCarouselItem,
  LayColorPicker,
}

const install = (app: App, options?: InstallOptions): void => {
  const _options = options
  app.config.globalProperties.$PROOPTIONS = _options

  for (const key in components) {
    const item = components[key]
    app.component(item.name || key, item)
  }
}

export {
  LayRadio,
  LayIcon,
  LayButton,
  LayLayout,
  LaySide,
  LayHeader,
  LayBody,
  LayFooter,
  LayLogo,
  LayPanel,
  LayCard,
  LayProgress,
  LayButtonGroup,
  LayButtonContainer,
  LayRow,
  LayCol,
  LayInput,
  LayBadge,
  LayBlock,
  LayLine,
  LayTimeline,
  LayTimelineItem,
  LayTextarea,
  LaySwitch,
  LayCollapse,
  LayCollapseItem,
  LayContainer,
  LayMenu,
  LayMenuItem,
  LayMenuChildItem,
  LayCheckbox,
  LayForm,
  LayBreadcrumb,
  LayBreadcrumbItem,
  LayAvatar,
  LayField,
  LaySelect,
  LayScroll,
  LaySelectOption,
  LayEmpty,
  LayFormItem,
  LayRate,
  LayDropdown,
  LayDropdownItem,
  LayTab,
  LayTabItem,
  LayIconPicker,
  LayTree,
  LayTable,
  LayPage,
  LayTransfer,
  LayCheckboxGroup,
  LaySlider,
  LayCarousel,
  LayCarouselItem,
  LayColorPicker,
  install,
}

export default { install }
