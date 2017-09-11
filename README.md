# rn-timer

## Description
<p>通用定时器组件，子控件可以自定义，由`Timer`来控制计时器的相关功能</p>
本组件**不提供** 任何 UI 样式，只提供定时器功能。

## Install
`$ npm install rn-timer --save`


## Props

|Props|Type|Optional|default|Description|
|:--|:--|:--|:--:|:--|
|timestamp|number|❎||未来的某个时间戳(计时结束时间戳)|
| timerStep |number|✅||时间跨度,1000则为1s|
| timerUnit |number|✅|ms|(未启用)|
| binders |object|✅||值映射对|
| timerFinishedListener |func|✅||计时器计时结束的回调|



## Usage
Class `TimerExample`

```javascript
export default class TimerExample extends Component {
  render() {
    const binder = { // 值-func 映射
      hour: (date: Date) => date.getUTCHours(),
      min: (date: Date) => date.getMinutes(),
      second: (date: Date) => date.getSeconds(),
    };

    return (
      <Timer
        timerStep={10}
        binders={binder}
        timestamp={new Date().getTime() + 50000}
        timerFinishedListener={() => {
          alert('end')
        }}>

		 // your cusotmer Timer Component
        <TimerUI/>

      </Timer>
    );
  }
}

```


class `TimerUI` (Your customer component)

```javascript
import React, {Component} from 'react';
import { StyleSheet,  Text,  View} from 'react-native';

export default class TimerUI extends Component {

  static propTypes: {
    hour: React.PropTypes.number,
    min: React.PropTypes.number,
    second: React.PropTypes.number,
  }

  render() {
    const {hour, min, second} = this.props

    return (
      <View style={{marginTop: 20, flexDirection: 'column'}}>
        <Text>
          {`hour: ${hour}`}
        </Text>
        <Text>
          {`min: ${min}`}
        </Text>
        <Text>
          {`second: ${second}`}
        </Text>
      </View>
    );
  }
}

```


![图片](https://raw.githubusercontent.com/react-io/rn-timer/master/images/example.gif)







