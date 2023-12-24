export default {
    "respCode": "29480000",
    "respMsg": "成功",
    "data": {
        "menuDTOList": [
            {
                "id": "2",
                "name": "开具发票",
                "level": "01",
                "childList": [
                    {
                        "id": "2-1",
                        "name": "开具发票",
                        "level": "02",
                        "type": "Q",
                        "disabled":true
                    }
                ]
            }, {
                "id": "3",
                "name": "账户",
                "level": "01",
                "childList": [{
                    "id": "3-1",
                    "name": "账务及存款查询",
                    "level": "02",
                    "type": "Q",
                    "childList": [{
                        "id": "3-1-1",
                        "name": "财务报表",
                        "level": "03",
                        "type": "Q",
                        "childList": [{
                            "id": "3-1-1-1",
                            "name": "财务报表",
                            "level": "03",
                            "type": "Q",
                            "childList": [{
                                "id": "3-1-1-1-1",
                                "name": "财务报表",
                                "level": "03",
                                "type": "Q",


                            },
                            {
                                "id": "3-1-1-1-2",
                                "name": "存款报表",
                                "level": "03",
                                "type": "R",
                            }]

                        },
                        {
                            "id": "3-1-1-2",
                            "name": "财务报表",
                            "level": "03",
                            "type": "Q",
                            "childList": [{
                                "id": "3-1-1-2-1",
                                "name": "财务报表",
                                "level": "03",
                                "type": "Q",


                            },
                            {
                                "id": "3-1-1-2-2",
                                "name": "存款报表",
                                "level": "03",
                                "type": "R",
                            }]

                        }
                        ]

                    },
                    ]
                }, {
                    "id": "18",
                    "name": "存款",
                    "level": "01",
                    "childList": [
                        {
                            "id": "18-1",
                            "name": "协定存款签约/解约",
                            "level": "02"
                        }, {
                            "id": "18-2",
                            "name": "存款存入/支取",
                            "level": "02"
                        }
                    ]
                },
                    // {
                    //     "id": "3-6",
                    //     "name": "询证函管理",
                    //     "level": "02",
                    //     "disabled": true,
                    //     "type": "2",

                    // }, {
                    //     "id": "3-7",
                    //     "name": "询证函查询",
                    //     "level": "02",
                    //     "type": "2",

                    // }
                ]
            }, {
                "id": "16",
                "name": "存款",
                "level": "01",
                "childList": [
                    {
                        "id": "3-5",
                        "name": "协定存款签约/解约",
                        "level": "02",
                    }, {
                        "id": "16-2",
                        "name": "存款存入/支取",
                        "level": "02",
                        'new':true
                    }
                ]
            }, {
                "id": "4",
                "name": "支付结算",
                "level": "01",
                "childList": [
                    {
                        "id": "4-1",
                        "name": "转账汇款",
                        "level": "02",
                        "new": true,
                        "type": "O",
                        'new':true

                    }, {
                        "id": "4-2",
                        "name": "发薪管理",
                        "level": "02",
                        "type": "O",

                    }
                ]
            }, {
                "id": "5",
                "name": "微业贷",
                "level": "01",
                "childList": [
                    {
                        "id": "5-1",
                        "name": "贷款查询",
                        "level": "02",
                        "new": true,
                        "type": "1",

                    }, {
                        "id": "5-2",
                        "name": "还款",
                        "level": "02",
                        "type": "O",

                    }, {
                        "id": "5-3",
                        "name": "退款",
                        "level": "02",
                        "type": "3",

                    }
                ]
            }, {
                "id": "6",
                "name": "微闪贴",
                "level": "01",
                "childList": [
                    {
                        "id": "6-1",
                        "name": "贴现查询",
                        "level": "02",
                        "new": true,
                        "type": "3",

                    }, {
                        "id": "6-2",
                        "name": "一键贴现",
                        "level": "02",
                        "new": true,
                        "type": "3",
                    }, {
                        "id": "6-3",
                        "name": "发票提额",
                        "level": "02",
                        "new": true,
                        "type": "3",

                    }, {
                        "id": "6-4",
                        "name": "交易资料上传",
                        "level": "02",
                        "type": "1",

                    }, {
                        "id": "6-5",
                        "name": "微闪贴-查询",
                        "level": "02",
                        "new": true,
                        "type": "2",

                    }, {
                        "id": "6-6",
                        "name": "协议付息合约管理",
                        "level": "02",
                        "type": "1",

                    }
                ]
            }, {
                "id": "7",
                "name": "票据管家",
                "level": "01",
                "childList": [
                    {
                        "id": "7-1",
                        "name": "票据查询",
                        "level": "02",
                        "type": "1",

                    }, {
                        "id": "7-2",
                        "name": "收票",
                        "level": "02",
                        "type": "1",
                    }, {
                        "id": "7-3",
                        "name": "付票",
                        "level": "02",
                        "type": "1",
                    }, {
                        "id": "7-4",
                        "name": "提示付款",
                        "level": "02",
                        "type": "1",
                    }, {
                        "id": "7-5",
                        "name": "不可转让撤销",
                        "level": "02",
                        "type": "1",
                    }, {
                        "id": "7-6",
                        "name": "不可转让撤销应答",
                        "level": "02",
                        "type": "1",
                    }
                ]
            }
        ]
    }
}