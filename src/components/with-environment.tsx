import { Component, cloneElement } from 'react'

import { getEnvironment } from '../get-env'
import { type DetectEnvParams } from '../detect-env'

export interface WithEnvironmentProps {
  // exactly one element must be provided
  children: JSX.Element
}

class WithEnvironment extends Component<WithEnvironmentProps> {
  constructor(props: WithEnvironmentProps) {
    super(props)
  }

  render(...args: any[]) {
    // unlike React, class components in Preact always receive `props` and `state` in render()
    // this is true for both Preact 8.x and 10.x
    const hasAnyArguments = args.length > 0
    const detectParams: DetectEnvParams = {
      context: { classRenderReceivesAnyArguments: hasAnyArguments },
    }

    const env = getEnvironment(detectParams)

    // passes the `env` down as a prop
    return cloneElement(this.props.children, { env })
  }
}

export { WithEnvironment }
