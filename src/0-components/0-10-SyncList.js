import React, { PureComponent, Fragment } from "react"

export default class extends PureComponent {
  render() {
    const { items, renderItem } = this.props
    return (
      <Fragment>
        {items.map(renderItem)}
      </Fragment>
    )
  }
}
