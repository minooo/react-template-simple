import React, { Component, Fragment } from "react"

const ErrorBox = ({ error, errorInfo }) => (
  <div>
    <h2>Something went wrong.</h2>
    <details style={{ whiteSpace: "pre-wrap" }}>
      {error && error.toString()}
      <br />
      {errorInfo.componentStack}
    </details>
  </div>
)

export default () => WrappedComponent => class extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
  }
  render() {
    const { error, errorInfo } = this.state
    return (
      <Fragment>
        {error && <ErrorBox error={error} errorInfo={errorInfo} />}
        <WrappedComponent />
      </Fragment>
    )
  }
}
