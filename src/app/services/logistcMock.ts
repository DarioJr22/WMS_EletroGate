//TODO - Mock pra mitigar erros 429 até que se ache uma solução viável pra filtro por logistica

export const logistic = [
        {
            "id": 14231,
            "descricao": "Correios (Contrato)",
            "tipoIntegracao": "CustomLogistic",
            "integracaoNativa": false,
            "situacao": "D",
            "integracao": {
                "id": 14849079389
            },
            "servicos": [
                {
                    "id": 2323644521
                },
                {
                    "id": 2323644524
                }
            ]
        },
        {
            "id": 214420,
            "descricao": "IS Entrega",
            "tipoIntegracao": "CustomLogistic",
            "integracaoNativa": false,
            "situacao": "D",
            "integracao": {
                "id": 14849079389
            },
            "servicos": []
        },
        {
            "id": 613611,
            "descricao": "J&T Express",
            "tipoIntegracao": "CustomLogistic",
            "integracaoNativa": false,
            "situacao": "H",
            "integracao": {
                "id": 14849079389
            },
            "servicos": [
                {
                    "id": 14895967119
                }
            ]
        },
        {
            "id": 26158,
            "descricao": "Jadlog",
            "tipoIntegracao": "Jadlog",
            "integracaoNativa": true,
            "situacao": "H",
            "integracao": {
                "id": 14849079384
            },
            "servicos": [
                {
                    "id": 3405174484
                },
                {
                    "id": 3418836316
                }
            ]
        },
        {
            "id": 626551,
            "descricao": "Loggi",
            "tipoIntegracao": "Loggi",
            "integracaoNativa": true,
            "situacao": "H",
            "integracao": {
                "id": 14849079387
            },
            "servicos": [
                {
                    "id": 14895986257
                }
            ]
        },
        {
            "id": 14228,
            "descricao": "Motoboy",
            "tipoIntegracao": "CustomLogistic",
            "integracaoNativa": false,
            "situacao": "H",
            "integracao": {
                "id": 14849079389
            },
            "servicos": [
                {
                    "id": 2323624550
                }
            ]
        },
        {
            "id": 14222,
            "descricao": "Retirada",
            "tipoIntegracao": "CustomLogistic",
            "integracaoNativa": false,
            "situacao": "D",
            "integracao": {
                "id": 14849079389
            },
            "servicos": []
        },
        {
            "id": 3141,
            "descricao": "SIGEP",
            "tipoIntegracao": "Correios",
            "integracaoNativa": true,
            "situacao": "H",
            "integracao": {
                "id": 14849079371
            },
            "servicos": [
                {
                    "id": 10244888654
                },
                {
                    "id": 10244888656
                }
            ]
        },
        {
            "id": 199809,
            "descricao": "Total Express",
            "tipoIntegracao": "TotalExpress",
            "integracaoNativa": true,
            "situacao": "D",
            "integracao": {
                "id": 14849079402
            },
            "servicos": []
        },
        {
            "id": 211672,
            "descricao": "Uello",
            "tipoIntegracao": "CustomLogistic",
            "integracaoNativa": false,
            "situacao": "D",
            "integracao": {
                "id": 14849079389
            },
            "servicos": []
        }
    ]


export const service =
  [
        {
            "id": 916693497,
            "descricao": "SEDEX (CONTRATO)",
            "codigo": "40096",
            "aliases": [
                "SEDEX (CONTRATO)"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "104625",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 129505837
            }
        },
        {
            "id": 916693498,
            "descricao": "PAC",
            "codigo": "41068",
            "aliases": [
                "PAC"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "109819",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 129505837
            }
        },
        {
            "id": 916693500,
            "descricao": "E-SEDEX STANDARD",
            "codigo": "81019",
            "aliases": [
                "E-SEDEX STANDARD"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "104672",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 129505837
            }
        },
        {
            "id": 1074085418,
            "descricao": "PAC CONTRATO AGENCIA",
            "codigo": "04669",
            "aliases": [
                "04669"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "124884",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 5347327435
            }
        },
        {
            "id": 1074085419,
            "descricao": "SEDEX CONTRATO AGENCIA",
            "codigo": "04162",
            "aliases": [
                "04162"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "124849",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 5347327435
            }
        },
        {
            "id": 2323556693,
            "descricao": "Envio Externo",
            "codigo": "0001",
            "aliases": [
                "b2w",
                "b2w nova API"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "1",
            "logistica": {
                "id": 14225
            },
            "transportador": {
                "id": 2323618475
            }
        },
        {
            "id": 2323557908,
            "descricao": "Retirar pessoalmente",
            "codigo": "00002",
            "aliases": [
                "Retirar pessoalmente"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "1",
            "logistica": {
                "id": 14222
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 2323624550,
            "descricao": "Motoboy",
            "codigo": "00001",
            "aliases": [
                "Motoboy",
                "Motoboy (Frete Grátis)"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "1",
            "logistica": {
                "id": 14228
            },
            "transportador": {
                "id": 16478709412
            }
        },
        {
            "id": 2323644521,
            "descricao": "SEDEX",
            "codigo": "001",
            "aliases": [
                "SEDEXX"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "1",
            "logistica": {
                "id": 14231
            },
            "transportador": {
                "id": 2323636733
            }
        },
        {
            "id": 2323644524,
            "descricao": "PAC",
            "codigo": "002",
            "aliases": [
                "PACC"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "2",
            "logistica": {
                "id": 14231
            },
            "transportador": {
                "id": 2323636733
            }
        },
        {
            "id": 3337482700,
            "descricao": "PAC CONTRATO AGENCIA LM",
            "codigo": "04367",
            "aliases": [
                "PAC CONTRATO AGENCIA LM",
                "PAC"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "160123",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 3337481992
            }
        },
        {
            "id": 3337482703,
            "descricao": "SEDEX CONTRATO AGENCIA LM",
            "codigo": "04154",
            "aliases": [
                "SEDEX CONTRATO AGENCIA LM",
                "SEDEX"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "160126",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 3337481992
            }
        },
        {
            "id": 3405174484,
            "descricao": ".Com",
            "codigo": "9",
            "aliases": [
                "Jadlog .COM",
                "9"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "9",
            "logistica": {
                "id": 26158
            },
            "transportador": {
                "id": 4477703828
            }
        },
        {
            "id": 3418836316,
            "descricao": ".Package",
            "codigo": "3",
            "aliases": [
                "Jadlog .PACKAGE",
                "3"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "3",
            "logistica": {
                "id": 26158
            },
            "transportador": {
                "id": 4477703828
            }
        },
        {
            "id": 3418836319,
            "descricao": "Pickup",
            "codigo": "40",
            "aliases": [
                "Jadlog .PICKUP",
                "JADP_01"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "40",
            "logistica": {
                "id": 26158
            },
            "transportador": {
                "id": 4477703828
            }
        },
        {
            "id": 3431247619,
            "descricao": "SEDEX 10 A FATURAR",
            "codigo": "40215",
            "aliases": [
                "SEDEX 10 A FATURAR"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "104707",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 5347327435
            }
        },
        {
            "id": 8632790538,
            "descricao": "Marketplace",
            "codigo": "00002",
            "aliases": [
                "Marketplace",
                "Envio Externo"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "2",
            "logistica": {
                "id": 14225
            },
            "transportador": {
                "id": 8632782292
            }
        },
        {
            "id": 10244888654,
            "descricao": "SEDEX CONTRATO AG",
            "codigo": "03220",
            "aliases": [
                "SEDEX CONTRATO AG",
                "03220",
                "04162"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162022",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 5347327435
            }
        },
        {
            "id": 10244888656,
            "descricao": "PAC CONTRATO AG",
            "codigo": "03298",
            "aliases": [
                "PAC CONTRATO AG",
                "03298",
                "04669"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162026",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 5347327435
            }
        },
        {
            "id": 14892664006,
            "descricao": "Standard",
            "codigo": "STD",
            "aliases": [
                "Standard"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "6",
            "logistica": {
                "id": 199809
            },
            "transportador": {
                "id": 15604513105
            }
        },
        {
            "id": 14892668126,
            "descricao": "Expresso",
            "codigo": "EXP",
            "aliases": [
                "Expresso",
                "TOTVIP"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "1",
            "logistica": {
                "id": 199809
            },
            "transportador": {
                "id": 15604513105
            }
        },
        {
            "id": 14892739886,
            "descricao": "Normal",
            "codigo": "2034",
            "aliases": [
                "uello",
                "Uello - Expresso",
                "ULO_EXP"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 1,
            "idCodigoServico": "1",
            "logistica": {
                "id": 211672
            },
            "transportador": {
                "id": 15648378854
            }
        },
        {
            "id": 14892759961,
            "descricao": "ISE_WS",
            "codigo": "959",
            "aliases": [
                "IS Entrega",
                "ISE_WS"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "1",
            "logistica": {
                "id": 214420
            },
            "transportador": {
                "id": 15658714561
            }
        },
        {
            "id": 14894773217,
            "descricao": "CORREIOS MINI ENVIOS CTR AG",
            "codigo": "04227",
            "aliases": [
                "CORREIOS MINI ENVIOS CTR AG"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "159982",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773218,
            "descricao": "SEDEX 12 CONTRATO AG",
            "codigo": "03140",
            "aliases": [
                "SEDEX 12 CONTRATO AG"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162015",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773219,
            "descricao": "SEDEX 10 CONTRATO AG",
            "codigo": "03158",
            "aliases": [
                "SEDEX 10 CONTRATO AG"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162016",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773220,
            "descricao": "SEDEX HOJE CONTRATO AG",
            "codigo": "03204",
            "aliases": [
                "SEDEX HOJE CONTRATO AG"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162020",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773221,
            "descricao": "SEDEX CONTR GRAND FORMATO",
            "codigo": "03212",
            "aliases": [
                "SEDEX CONTR GRAND FORMATO"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162021",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773222,
            "descricao": "PAC CONTR GRAND FORMATO",
            "codigo": "03328",
            "aliases": [
                "PAC CONTR GRAND FORMATO"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162029",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773223,
            "descricao": "CARTA SIMPLES SELO E SE PCTE",
            "codigo": "80152",
            "aliases": [
                "CARTA SIMPLES SELO E SE PCTE"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162134",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773224,
            "descricao": "CARTA SIMPLES CHANCELA PCTE",
            "codigo": "80160",
            "aliases": [
                "CARTA SIMPLES CHANCELA PCTE"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162135",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773225,
            "descricao": "CARTA RG O4 CHANC ETIQUETA",
            "codigo": "80659",
            "aliases": [
                "CARTA RG O4 CHANC ETIQUETA"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162166",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773226,
            "descricao": "CARTA REG O4 MFD",
            "codigo": "80675",
            "aliases": [
                "CARTA REG O4 MFD"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162167",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773227,
            "descricao": "CARTA RG AR CONV O4 CHAN ETIQ",
            "codigo": "80691",
            "aliases": [
                "CARTA RG AR CONV O4 CHAN ETIQ"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162168",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773228,
            "descricao": "CARTA REG AR CONV O4 MFD",
            "codigo": "80705",
            "aliases": [
                "CARTA REG AR CONV O4 MFD"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162169",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773229,
            "descricao": "CARTA RG AR ELTR O4 CHANC ETIQ",
            "codigo": "80969",
            "aliases": [
                "CARTA RG AR ELTR O4 CHANC ETIQ"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162408",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773230,
            "descricao": "SEDEX HOJE EMPRESARIAL",
            "codigo": "03662",
            "aliases": [
                "SEDEX HOJE EMPRESARIAL"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162414",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773231,
            "descricao": "CARTA REG AR ELET O4 MFD",
            "codigo": "80217",
            "aliases": [
                "CARTA REG AR ELET O4 MFD"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "162462",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773232,
            "descricao": "TRANSFER LOG",
            "codigo": "03972",
            "aliases": [
                "TRANSFER LOG"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "165398",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773233,
            "descricao": "PAC REVERSO",
            "codigo": "03301",
            "aliases": [
                "PAC REVERSO"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "03301",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773234,
            "descricao": "SEDEX REVERSO",
            "codigo": "03247",
            "aliases": [
                "SEDEX REVERSO"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "03247",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773235,
            "descricao": "SEDEX 10 REVERSO",
            "codigo": "03182",
            "aliases": [
                "SEDEX 10 REVERSO"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "03182",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773236,
            "descricao": "SEDEX 12 REVERSO",
            "codigo": "03174",
            "aliases": [
                "SEDEX 12 REVERSO"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "03174",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773237,
            "descricao": "SEDEX HOJE REVERSO",
            "codigo": "03190",
            "aliases": [
                "SEDEX HOJE REVERSO"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "03190",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773238,
            "descricao": "PAC REVERSO 03115",
            "codigo": "03115",
            "aliases": [
                "PAC REVERSO 03115"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "03115",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773239,
            "descricao": "SEDEX REVERSO 03077",
            "codigo": "03077",
            "aliases": [
                "SEDEX REVERSO 03077"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "03077",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773240,
            "descricao": "SEDEX REVERSO 04170 LM",
            "codigo": "04243",
            "aliases": [
                "SEDEX REVERSO 04170 LM"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "04243",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773241,
            "descricao": "SEDEX 10 REVERSO A FATURAR",
            "codigo": "040584",
            "aliases": [
                "SEDEX 10 REVERSO A FATURAR"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "040584",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773242,
            "descricao": "SEDEX REVERSO ESPELHO 04162",
            "codigo": "04170",
            "aliases": [
                "SEDEX REVERSO ESPELHO 04162"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "04170",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773243,
            "descricao": "SEDEX REVERSO TA ESPELHO 04553",
            "codigo": "04928",
            "aliases": [
                "SEDEX REVERSO TA ESPELHO 04553"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "04928",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773244,
            "descricao": "PAC REVERSO ESPELHO 04669",
            "codigo": "04677",
            "aliases": [
                "PAC REVERSO ESPELHO 04669"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "04677",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14894773245,
            "descricao": "PAC REVERSO TA ESPELHO 04596",
            "codigo": "04936",
            "aliases": [
                "PAC REVERSO TA ESPELHO 04596"
            ],
            "ativo": false,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "04936",
            "logistica": {
                "id": 3141
            },
            "transportador": {
                "id": 0
            }
        },
        {
            "id": 14895967119,
            "descricao": "J&T Standard",
            "codigo": "",
            "aliases": [
                "54680",
                "JT_WS"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "1",
            "logistica": {
                "id": 613611
            },
            "transportador": {
                "id": 17617846181
            }
        },
        {
            "id": 14895986257,
            "descricao": "Econômico (Dropoff)",
            "codigo": "ECON_DROPOFF",
            "aliases": [
                "FREIGHT_TYPE_ECONOMIC_DROPOFF",
                "LOG_WS_3"
            ],
            "ativo": true,
            "freteItem": 0,
            "estimativaEntrega": 0,
            "idCodigoServico": "11",
            "logistica": {
                "id": 626551
            },
            "transportador": {
                "id": 0
            }
        }
    ]


export const salesChanel = [
        {
            "id": 203144843,
            "descricao": "Eletrogate",
            "tipo": "LojaIntegrada",
            "situacao": 1
        },
        {
            "id": 203198882,
            "descricao": "B2W",
            "tipo": "B2W",
            "situacao": 2
        },
        {
            "id": 203273655,
            "descricao": "Teste",
            "tipo": "LojaVirtual",
            "situacao": 2
        },
        {
            "id": 203347541,
            "descricao": "Marketplace B2W",
            "tipo": "B2W",
            "situacao": 2
        },
        {
            "id": 203451091,
            "descricao": "Plugg.to",
            "tipo": "PluggTo",
            "situacao": 2
        },
        {
            "id": 203633820,
            "descricao": "MercadoLivre",
            "tipo": "Api",
            "situacao": 2
        },
        {
            "id": 203758493,
            "descricao": "Shopee",
            "tipo": "Shopee",
            "situacao": 2
        },
        {
            "id": 204830429,
            "descricao": "Plugg.To v2",
            "tipo": "Api",
            "situacao": 1
        }
    ]

