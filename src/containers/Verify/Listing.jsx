import React, {Component} from 'react';
import {Card} from '../../components/Card/Card.jsx';
import Address from '../../views/Components/Address.jsx';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import {observer} from "mobx-react";
import {InputGroup, ButtonToolbar, Button, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import Gallery from "../../public/lib/react-grid-gallery/Gallery.js";
import {Creatable} from 'react-select';

const PRICE_UNITS = [
    {'value': 1, 'name': 'Triệu'},
    {'value': 2, 'name': 'Triệu/m2'},
    {'value': 3, 'name': 'Tỷ'},
    {'value': 4, 'name': 'USD'},
    {'value': 5, 'name': 'USD/m2'},
    {'value': 6, 'name': 'Nghìn'},
    {'value': 7, 'name': 'Nghìn/m2'},
    {'value': 8, 'name': 'Triệu/m2/tháng'},
    {'value': 9, 'name': 'USD/m2/tháng'},
    {'value': 10, 'name': 'Triệu/Tháng'},
    {'value': 11, 'name': 'USD/Tháng'},
];


@observer
class Listing extends Component {

    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
        this.state = {
            tit: this.props.tit,
            des: this.props.des,
            are: this.props.are,
            areaUnit: this.props.areaUnitId,
            widthArea: this.props.widthArea,
            lengthArea: this.props.lengthArea,
            pri: this.props.pri,
            unit: this.props.unit,
            mode: this.props.mode,
            typ: this.props.typ,
            acc: this.props.acc,
            rawId: this.props.rawId,
            id: this.props.listing.id,
            leg: 0,
            nob: this.props.nob,
            now: this.props.now,
            dir: this.props.dir,
            nof: this.props.nof,
            streetWidth: this.props.streetWidth,
            fea: [],
            fac: [],
            landmark: [],
            img: this.parseImg(this.props.img),
            landmarkSelection: this.props.appStore.landmarkSelection.slice(),
            projectSelection: this.props.appStore.projectSelection.slice(),
            add: this.props.address
        }
        this.onSelectImage = this.onSelectImage.bind(this);
        this.onSelectFirstImage = this.onSelectFirstImage.bind(this);

        let currentMode = this.state.mode;
        let typeOptions = this.props.typeOptions || [];
        this.state.typeOptions = this.getTypeOptionsByMode(typeOptions, currentMode);
        this.state.modeOptions = this.props.modeOptions || [];

        // disable title if mode object is request
        this.state.isRequest = this.isRequest(this.state.mode);
        this.onKeyboardDown = this.onKeyboardDown.bind(this);
    }

    getTypeOptionsByMode(typeOptions, currentMode) {
        return typeOptions.filter(function (t) {
            return t.transactionTypeId == currentMode;
        });
    }

    shouldComponentUpdate(newProps) {
        if (!!newProps.typeOptions) {
            this.state.typeOptions = this.getTypeOptionsByMode(newProps.typeOptions, this.state.mode);
        }
        return true;
    }

    componentDidMount() {
        this.doneVerifying();
    }

    onKeyboardDown(e) {
        let selectedText = window.getSelection().toString();
        let isMultiKey = false;
        if (selectedText != "") {
            let textarea = e.target;
            if (typeof textarea.selectionStart == 'number' && typeof textarea.selectionEnd == 'number') {
                let start = textarea.selectionStart;
                let end = textarea.selectionEnd;
                if (e.nativeEvent.ctrlKey && e.nativeEvent.shiftKey) {
                    selectedText = selectedText.toUpperCase();
                    isMultiKey = true;
                } else if (e.nativeEvent.ctrlKey && e.nativeEvent.altKey) {
                    selectedText = selectedText.toLowerCase();
                    isMultiKey = true;
                } else if (e.nativeEvent.altKey && e.nativeEvent.shiftKey) {
                    selectedText = selectedText.toLowerCase().replace(/^\w|\s\w|^[^\u0000-\u007F]|\s[^\u0000-\u007F]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                    isMultiKey = true;
                }
                if (isMultiKey) {
                    if (textarea.className.indexOf("title") !== -1) {
                        this.state.tit = this.state.tit.substring(0, start) + selectedText + this.state.tit.substring(end, this.state.tit.length);
                    } else if (textarea.className.indexOf("detail") !== -1) {
                        this.state.des = this.state.des.substring(0, start) + selectedText + this.state.des.substring(end, this.state.des.length);
                    }

                    this.doneVerifying();
                }
            }
        }
    }

    parseImg(url) {
        let result = []
        for (let i = 0; i < url.length; i++) {
            result.push({
                src: url[i],
                thumbnail: url[i],
                thumbnailWidth: 90,
                thumbnailHeight: 120,
                isSelected: true,
                isFirst: false
            })
        }
        if (url.length >= 1) {
            result[0].isFirst = true;
        }
        return result;
    }

    isRequest(modeValue) {
        if (this.state.modeOptions) {
            let modeObject = this.state.modeOptions.filter(function (t) {
                return t.id == modeValue;
            });
            if (modeObject && modeObject.length > 0) {
                return modeObject[0].isRequest;
            }
        }
        return false;
    }

    onSelectImage(index) {
        var images = this.state.img.slice();
        var img = images[index];
        if (img.hasOwnProperty("isSelected")) {
            img.isSelected = !img.isSelected;
            if (img.isSelected == false)
                img.isFirst = false;
        }
        else
            img.isSelected = true;
        this.setState({
            img: images
        });
        this.doneVerifying();
    }

    onSelectFirstImage(index) {

        var images = this.state.img.slice();
        var img = images[index];
        if (img.isSelected) {
            if (!img.hasOwnProperty("isFirst") || img.isFirst == false)
                images.map(image => {
                    if (image.hasOwnProperty("isFirst"))
                        image.isFirst = false;
                });

            if (img.hasOwnProperty("isFirst"))
                img.isFirst = !img.isFirst;
            else
                img.isFirst = true;

            this.setState({
                img: images
            });
            this.doneVerifying();
        }
    }

    onModeUpdate(e) {
        let modeValue = e;
        this.setState({mode: modeValue}, () => {
            this.doneVerifying();
        });

        // filter type options based on current mode
        let filteredTypeOptions = this.props.typeOptions.filter(function (t) {
            return t.transactionTypeId == modeValue;
        });
        this.setState({typeOptions: filteredTypeOptions}, () => {
            this.doneVerifying();
        });

        // disable title if mode object is request
        this.setState({isRequest: this.isRequest(modeValue)}, () => {
            this.doneVerifying();
        });
    }

    onTitleUpdated(e) {
        console.log("change");
        this.setState({tit: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onLandmarkUpdated(value) {
        if (value.length > this.state.landmark.length) {
            let newLabel = value[value.length - 1].label;
            //Exist
            for (let i = 0; i < this.props.appStore.landmarkSelection.length; i++) {
                if (newLabel == this.props.appStore.landmarkSelection[i].label) {
                    this.setState({landmark: value}, () => {
                        this.doneVerifying();
                    });
                    return;
                }
            }
            //new
            this.props.appStore.createNewLandmark(newLabel, this.props.tok, (newLandmark) => {
                value.pop();
                if (newLandmark != null) {
                    value.push(newLandmark);
                }
                this.setState({landmark: value}, () => {
                    this.doneVerifying();
                });
            });
        } else {
            //Delete
            this.setState({landmark: value}, () => {
                this.doneVerifying();
            });
        }
    }

    onLandmarkChange(inputValue) {
        this.props.appStore.searchLandmark(inputValue, this.props.tok, (err, response) => {
            this.setState({landmarkSelection: this.props.appStore.landmarkSelection.slice()})
        });

    }


    onProjectUpdated(value) {
        this.setState({project: value}, () => {
            this.doneVerifying();
        });
    }

    onProjectChange(inputValue) {
        this.props.appStore.searchProject(inputValue, this.props.tok, (err, body) => {
            this.setState({projectSelection: this.props.appStore.projectSelection.slice()})
        });

    }

    onLengthAreaUpdated(e) {
        this.setState({lengthArea: e.target.value}, () => {
            this.state.are = this.state.lengthArea * this.state.widthArea;
            this.doneVerifying();
        })

    }

    onWidthAreaUpdated(e) {
        this.setState({widthArea: e.target.value}, () => {
            this.state.are = this.state.lengthArea * this.state.widthArea;
            this.doneVerifying();
        })
    }

    onNoteUpdate(e) {
        this.setState({adminNote: e.target.value}, () => {
            this.doneVerifying();
        });
    }

    onStreetWidthUpdated(e) {
        this.setState({streetWidth: e.target.value}, () => {
            this.doneVerifying();
        })

    }

    onPriceUnitChanged(e) {
        this.setState({unit: e.target.value}, () => {
            this.doneVerifying();
        })

    }

    onDescriptionUpdated(e) {
        this.setState({des: e.target.value}, () => {
            this.doneVerifying();
        })

    }

    onPriceUpdated(e) {
        this.setState({pri: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onAreaUpdated(e) {
        this.setState({are: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onAreaUnitUpdated(e) {
        this.setState({areaUnit: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onDirectionUpdated(e) {
        this.setState({dir: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onTypeUpdated(e) {
        let realEstateTypeId = parseInt(e.target.value);
        this.setState({typ: realEstateTypeId}, () => {
            this.doneVerifying();
        })
    }

    onLegitUpdated(e) {
        this.setState({leg: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onAccessLevelUpdated(e) {
        this.setState({acc: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onAddressUpdated(address) {
        this.setState({add: address.address, lat: address.latLng.lat, lon: address.latLng.lng}, () => {
            this.doneVerifying();
        })
    }

    onNumberOfBathroomBUpdated(e) {
        this.setState({now: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onNumberOfFloorUpdated(e) {
        this.setState({nof: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onNumberOfBedroomUpdated(e) {
        this.setState({nob: e.target.value}, () => {
            this.doneVerifying();
        })
    }

    onFeaturesChanged(e) {
        this.setState({fea: e}, () => {
            this.doneVerifying();
        })
    }

    onInfrastructureChanged(e) {
        this.setState({fac: e}, () => {
            this.doneVerifying();
        })
    }

    autosize() {
        let el = this;
        setTimeout(function () {
            el.style.cssText = 'height:auto; padding:5px';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 0);
    }

    isFooBar() {
        return /((((gia|gia|giia|gía|giá|GIÁ :))\s*((\d+(\.|\,)\d*)|\d+)\s*(ty|ti|tỉ|tỷ|tỷ|TỶ|TỈ|\$|\(\$\)|usd|USD|triệu|triệu\/ tháng|tr|tr\/th)*|((\d+(\.|\,)\d*)|\d+)\s*(ty|ti|tỉ|tỷ|tỷ|TỶ|TỈ|\$|\(\$\)|usd|USD|triệu|triệu\/ tháng|tr|tr\/th))(\s*\d*|\ |\;|\.|\,))|(((09|01\d)(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d(\ |-)*\d))|((dt\sđất|dt\ssàn|dt|DT\s*|Dt:\s*)\s((\d+(\.|\,)\d*)|\d+)\s*(M2|m2|m)|((\d+(\.|\,)\d*)|\d+)(x|\*|\-)((\d+(\.|\,)\d*)|\d+)\s*(M2|m2|m|\ )|((\d+(\.|\,)\d*)|\d+)\s*(M2|m2|m)(\ |\,))|((b|B)(á|Á|a)(n|N))|(((c|C)(h|H)(o|O))(\s((T|t)(H|h)(U|u)(E|e|Ê|ê))))|(((C|c)(Ầ|ầ|A|a)(N|n))*\s((m|M)ua))|(((C|c)(Ầ|ầ|A|a)(N|n))\s((T|t)(H|h)(U|u)(E|e|Ê|ê))|((T|t)(H|h)(U|u)(E|e|Ê|ê)))/ig
    }

    doneVerifying() {
        this.props.store.doneVerifying(this.state);
    }

    deleteListing() {
        this.props.store.deleteListing(this.state.id);
    }

    render() {
        return (
            <Card
                title=""
                content={
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <ControlLabel>Loại GĐ:</ControlLabel>
                                <ButtonToolbar>
                                    <ToggleButtonGroup type="radio" name="mode" defaultValue={this.props.mode}
                                                       onChange={this.onModeUpdate.bind(this)}>
                                        {this.props.modeOptions.map(option => {
                                            return <ToggleButton value={option.id}>{option.name}</ToggleButton>
                                        })}
                                    </ToggleButtonGroup>
                                </ButtonToolbar>
                            </div>

                            <div className="col-md-2">
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Loại BĐS: </ControlLabel>
                                    <FormControl bsClass='form-control' componentClass="select" placeholder="select"
                                                 value={this.state.typ} onChange={this.onTypeUpdated.bind(this)}>
                                        {this.state.typeOptions.map(option => {
                                            return <option defaultValue={this.state.typ == option.value}
                                                           value={option.id}>{option.name}</option>
                                        })}
                                    </FormControl>
                                </FormGroup>
                            </div>
                            <div className="col-md-2">
                                <FormGroup controlId="formControlsSelect">
                                    <ControlLabel>Quyền Xem</ControlLabel>
                                    <FormControl bsClass='form-control' componentClass="select" placeholder="select"
                                                 value={this.state.acc} onChange={this.onAccessLevelUpdated.bind(this)}>
                                        <option defaultValue={this.state.acc == 1} value="1">Cá Nhân
                                        </option>
                                        <option defaultValue={this.state.acc == 2} value="2">Bạn Bè
                                        </option>
                                        <option defaultValue={this.state.acc == 3} value="3">Cộng Đồng
                                        </option>
                                    </FormControl>
                                </FormGroup>
                            </div>
                            <div className="col-md-2">
                                <Button
                                    className="deleteButton"
                                    onClick={this.deleteListing.bind(this)}>
                                    XÓA
                                </Button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup
                                    controlId="formBasicText">
                                    <ControlLabel>Tiêu Đề </ControlLabel>
                                    <FormControl rows="2"
                                                 componentClass="textarea"
                                                 bsClass="form-control"
                                                 defaultValue={this.props.title}
                                                 value={this.state.tit}
                                                 onChange={this.onTitleUpdated.bind(this)}
                                                 onKeyDown={this.onKeyboardDown}
                                                 disabled={this.state.isRequest}
                                                 className="title"
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup
                                    controlId="formBasicText"
                                >
                                    <ControlLabel>Địa Chỉ: </ControlLabel>
                                    <Address value={this.state.add}
                                             onChange={this.onAddressUpdated.bind(this)}></Address>
                                </FormGroup>
                            </div>
                        </div>


                        <FormGroup controlId="">
                            <ControlLabel>Mô Tả Chi Tiết</ControlLabel>
                            <FormControl rows="15" componentClass="textarea" bsClass="form-control"
                                         placeholder="Test can be your description"
                                         value={this.state.des}
                                         onChange={this.onDescriptionUpdated.bind(this)}
                                         onKeyDown={this.onKeyboardDown}
                                         className="detail"
                            />

                        </FormGroup>
                        <div className="row">
                            <div className="col-md-3">
                                <FormGroup controlId="formBasicText">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FormControl type="number"
                                                         step="0.01"
                                                         defaultValue={this.props.pri}
                                                         className="control"
                                                         onChange={this.onPriceUpdated.bind(this)}
                                                         placeholder="Giá"/>
                                        </div>
                                        <div className="col-md-6">
                                            <FormControl bsClass='form-control' componentClass="select"
                                                         value={this.state.unit}
                                                         onChange={this.onPriceUnitChanged.bind(this)}
                                                         placeholder="select price unit">
                                                {
                                                    PRICE_UNITS.map(option => {
                                                        return <option defaultValue={this.state.unit == option.value}
                                                                       value={option.value}>{option.name}</option>
                                                    })
                                                }
                                            </FormControl>
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FormControl
                                                type="number"
                                                step="0.01"
                                                defaultValue={this.props.are}
                                                value={this.state.are}
                                                onChange={this.onAreaUpdated.bind(this)}
                                                placeholder="Diện Tích"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <FormGroup controlId="formControlsSelect">
                                                <FormControl bsClass='form-control' componentClass="select"
                                                             value={this.state.areaUnit}
                                                             onChange={this.onAreaUnitUpdated.bind(this)}
                                                             placeholder="select square unit">
                                                    <option defaultValue={this.state.areaUnit == 0} value="0">-</option>
                                                    <option defaultValue={this.state.areaUnit == 1} value="1">m2
                                                    </option>
                                                    <option defaultValue={this.state.areaUnit == 2} value="2">ha
                                                    </option>
                                                </FormControl>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </FormGroup>
                            </div>
                            <div className="col-md-2">
                                <FormGroup controlId="formBasicText">
                                    <InputGroup>
                                        <FormControl
                                            type="number"
                                            step="0.01"
                                            defaultValue={this.props.lengthArea}
                                            onChange={this.onLengthAreaUpdated.bind(this)}
                                            placeholder="Dài"
                                            title="Dài"
                                        />
                                        <InputGroup.Addon>
                                            m
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup controlId="formBasicText">
                                    <InputGroup>
                                        <FormControl
                                            type="number"
                                            step="0.01"
                                            defaultValue={this.props.widthArea}
                                            onChange={this.onWidthAreaUpdated.bind(this)}
                                            placeholder="Rộng"
                                            title="Rộng"
                                        />
                                        <InputGroup.Addon>
                                            m
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FormGroup>
                            </div>
                            <div className="col-md-2">
                                <FormGroup
                                    controlId="formBasicText"
                                >
                                    <FormControl
                                        type="number"
                                        step="1"
                                        defaultValue={this.props.now}
                                        onChange={this.onNumberOfBathroomBUpdated.bind(this)}
                                        placeholder="Phòng Tắm"
                                        title="Phòng Tắm"
                                    />
                                </FormGroup>
                                <FormGroup
                                    controlId="formBasicText"
                                >
                                    <FormControl
                                        type="number"
                                        step="1"
                                        defaultValue={this.props.nob}
                                        onChange={this.onNumberOfBedroomUpdated.bind(this)}
                                        placeholder="Phòng Ngủ"
                                        title="Phòng Ngủ"
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-md-3">
                                <FormGroup
                                    controlId="formBasicText"
                                >
                                    <FormControl
                                        type="number"
                                        step="1"
                                        defaultValue={this.props.nof}
                                        onChange={this.onNumberOfFloorUpdated.bind(this)}
                                        placeholder="Tầng"
                                        title="Tầng"
                                    />
                                </FormGroup>
                                <FormGroup
                                    controlId="formBasicText"
                                >
                                    <FormControl
                                        type="number"
                                        step="1"
                                        defaultValue={this.props.streetWidth}
                                        placeholder="Đường Trước Nhà"
                                        onChange={this.onStreetWidthUpdated.bind(this)}
                                        title="Đường Trước Nhà"
                                    />
                                </FormGroup>
                            </div>
                            <div className="col-md-2">
                                <FormGroup controlId="formControlsSelect">
                                    <FormControl bsClass='form-control' componentClass="select"
                                                 defaultValue={this.state.leg} value={this.state.leg}
                                                 onChange={this.onLegitUpdated.bind(this)}
                                                 placeholder="select">
                                        <option value="0">Pháp Lý</option>
                                        <option value="1">Sổ hồng</option>
                                        <option value="2">Giấy đỏ</option>
                                        <option value="3">Giấy tay</option>
                                        <option value="4">Đang hợp thức hoá</option>
                                        <option value="5">Giấy tờ hợp lệ</option>
                                        <option value="6">Chủ quyền tư nhân</option>
                                        <option value="7">Hợp đồng</option>
                                    </FormControl>
                                </FormGroup>
                                <FormGroup controlId="formControlsSelect">
                                    <FormControl bsClass='form-control' componentClass="select"
                                                 defaultValue={this.state.dir} value={this.state.dir}
                                                 onChange={this.onDirectionUpdated.bind(this)}
                                                 placeholder="Select Direction">
                                        <option value="0">Hướng</option>
                                        <option value="1">Bắc</option>
                                        <option value="2">Đông bắc</option>
                                        <option value="3">Đông nam</option>
                                        <option value="4">Đông</option>
                                        <option value="5">Nam</option>
                                        <option value="6">Tây nam</option>
                                        <option value="7">Tây</option>
                                        <option value="8">Tây bắc</option>
                                    </FormControl>
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <ButtonToolbar>
                                            <ToggleButtonGroup type="checkbox"
                                                               onChange={this.onFeaturesChanged.bind(this)}>
                                                <ToggleButton value={1}>Máy lạnh</ToggleButton>
                                                <ToggleButton value={2}>Máy sưởi</ToggleButton>
                                                <ToggleButton value={3}>Ti vi</ToggleButton>
                                                <ToggleButton value={4}>Wifi</ToggleButton>
                                                <ToggleButton value={5}>Bồn Tắm</ToggleButton>
                                                <ToggleButton value={6}>Máy Nóng Lạnh</ToggleButton>
                                            </ToggleButtonGroup>
                                        </ButtonToolbar>
                                    </div>
                                    <div className="col-md-6">
                                        <ButtonToolbar>
                                            <ToggleButtonGroup type="checkbox"
                                                               onChange={this.onInfrastructureChanged.bind(this)}>
                                                <ToggleButton value={1}>Hồ bơi</ToggleButton>
                                                <ToggleButton value={2}>Trường học</ToggleButton>
                                                <ToggleButton value={3}>Gần bờ sông</ToggleButton>
                                                <ToggleButton value={4}>Bệnh viện</ToggleButton>
                                                <ToggleButton value={5}>Đường lớn</ToggleButton>
                                                <ToggleButton value={6}>Siêu Thị</ToggleButton>
                                            </ToggleButtonGroup>
                                        </ButtonToolbar>
                                    </div>
                                </div>

                                <div className="row">
                                    <FormGroup controlId="formBasicText">
                                        <FormControl
                                            type="text"
                                            defaultValue={this.props.adminNode}
                                            placeholder="Ghi Chú"
                                            onChange={this.onNoteUpdate.bind(this)}/>
                                    </FormGroup>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <Creatable
                                            name="LandmarkSelection"
                                            placeholder="Landmark"
                                            multi={true}
                                            value={this.state.landmark}
                                            options={this.state.landmarkSelection}
                                            onInputChange={this.onLandmarkChange.bind(this)}
                                            onChange={this.onLandmarkUpdated.bind(this)}>
                                        </Creatable>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <Creatable
                                            name="ProjectSelection"
                                            placeholder="Project"
                                            value={this.state.project}
                                            options={this.state.projectSelection}
                                            onInputChange={this.onProjectChange.bind(this)}
                                            onChange={this.onProjectUpdated.bind(this)}>
                                        </Creatable>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <Gallery images={this.state.img}
                                         onSelectImage={this.onSelectImage}
                                         onSelectFirstImage={this.onSelectFirstImage}/>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </form>
                }
            />
        );
    }
}

export default Listing;
