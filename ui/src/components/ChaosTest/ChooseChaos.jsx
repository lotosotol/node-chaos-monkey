/** @format */

import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import DropdownComponent from './DropdownComponent';

// Styles
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import Card from 'react-bootstrap/lib/Card';

@inject('store')
@observer
class ChooseChaos extends Component {
  interval = null;
  state = {
    selectedPrank: '',
    pranks: [
      {name: 'Random with surprises'},
      {name: 'Exhausted hardware'},
      {name: 'Error handling benchmark'},
      {name: 'Slow and comprhensive'},
    ],
  };

  componentDidMount() {
    this.props.store.getSinglePranksList();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  createPrankandStart = () => {
    this.props.store.addPrank(this.state.selectedPrank);
    this.makeCall();
    this.props.store.getPranksLog();
    this.setState({prankRunning: true});
  };

  makeCall() {
    this.interval = setInterval(() => {
      this.props.store.callApi('http://localhost:8081/chaos/pranks-pool');
    }, 500);
  }

  selectPrank = prank => {
    this.setState({selectedPrank: prank});
    setTimeout(() => {
      console.log('Selected Prank', this.state.selectedPrank.name);
    }, 0);
  };

  stopPrank = () => {
    this.props.store.disconnect();
    clearInterval(this.interval);
  };

  selectPrankTEST = prank => {
    console.log(prank);
  };

  render() {
    const {singlePranks, prankRunning} = this.props.store;
    const {selectedPrank, pranks} = this.state;

    return (
      <Col lg="5" md="8" className="mb-5">
        <Card bg="light">
          <Card.Header>Choose Chaos</Card.Header>
          <Card.Body>
            {!prankRunning && (
              <>
                <DropdownComponent
                  items={pranks}
                  title="Pranks Plan"
                  onClick={prank => this.selectPrankTEST(prank)}
                  selectedPrank={this.state.selectPrank}
                />
                <Row className="my-5">
                  <Col md="2" xs="3">
                    OR
                  </Col>
                  <Col md="10" xs="9">
                    <hr style={{backgroundColor: 'black'}} />
                  </Col>
                </Row>
                <DropdownComponent
                  items={singlePranks}
                  title="Single Prank"
                  onClick={prank => this.selectPrank(prank)}
                  selectedPrank={selectedPrank}
                />
              </>
            )}
            <Row className="mt-4 mb-3">
              <Col xs="3">
                <Button
                  variant={selectedPrank ? 'primary' : 'secondary'}
                  onClick={this.createPrankandStart}
                  disabled={!selectedPrank ? !prankRunning : prankRunning}
                >
                  Start prank
                </Button>
              </Col>
              <Col xs={{span: 3, offset: 1}}>
                <Button
                  variant={prankRunning ? 'danger' : 'secondary'}
                  onClick={this.stopPrank.bind(this)}
                  disabled={!prankRunning}
                >
                  Stop prank
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
  }
}

export default ChooseChaos;
