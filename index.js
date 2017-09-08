import React, {PureComponent, PropTypes} from 'react'
import {View} from 'react-native'
import {BehaviorSubject, Observable} from "@reactivex/rxjs";

/**
 * Created by HyperSimon
 */
export default class Timer extends PureComponent {

  static propTypes = {
    timestamp: PropTypes.number.isRequired, // 未来的某个时间戳
    timerStep: PropTypes.number, // 计时器 step, 当前默认单位是 s
    timerUnit: PropTypes.number, // 计时器 unit  not in use yet
    binders: PropTypes.object, // 值映射对
    timerFinishedListener: PropTypes.func, // 计时器计时结束的回调
  };

  state = {
    freeTime: null,
  };
  subscriptions = [];

  timerFinished$ = new BehaviorSubject(false); // 0 is the initial value

  constructor() {
    super()
  }

  componentWillMount() {
    const endTimeStamp = this.props.timestamp
    const currentTimeStramp = new Date().getTime()
    const freeTime = endTimeStamp - currentTimeStramp > 0 ? endTimeStamp - currentTimeStramp : 0
    this.setState({
      freeTime: new Date(freeTime)
    })
  }

  componentDidMount() {
    const {timerStep, timerFinishedListener} = this.props;

    // 定时器的rx实现
    const timerSub = Observable
      .interval(timerStep)
      .timeInterval()
      .map((next) => {
        const freeTime = this.state.freeTime.getTime()
        if (freeTime > 0) return freeTime - next.interval // get new timestamp
        else return 0
      })
      .subscribe(newTimeStamp => {
        this.setState({freeTime: new Date(newTimeStamp)})
        if (newTimeStamp === 0) this.timerFinished$.next(true) // emit timer finished observable
      }, error => {
        // do nothing
      });

    const timerFinishedSub = this.timerFinished$.subscribe({
      next: (isFinished) => {
        if (isFinished) {
          timerFinishedListener()
          timerSub.unsubscribe()
        }
      }
    })

    this.subscriptions.push(timerSub);
    this.subscriptions.push(timerFinishedSub)
  }

  render() {
    const {binders} = this.props

    return (
      <View style={{...this.props.style}}>
        {React.cloneElement(this.props.children, this.makeProps(binders))}
      </View>
    )
  }

  makeProps(binders) {
    const childProps = {}

    for (b in binders) {
      childProps[b] = binders[b](this.state.freeTime)
    }

    return childProps
  }

  componentWillUnmount() {
    if (this.subscriptions) for (s in this.subscriptions) s.unsubscribe()
  }
}
