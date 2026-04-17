const DATA = {
    abril: {
        saldo: 'R$ 4.820',
        tx: [
            { icon:'HS', cat:'house', name:'Aluguel', date:'01 abr', amount:'-1.200', type:'expense'},
            { icon:'FD', cat:'food',  name:'Alimentação', date:'03 abr', amount:'-68,50', type:'expense'},
            { icon:'IN', cat:'income',name:'Salário', date:'05 abr', amount:'+5.000', type:'income'}
        ],
        budget: [
            { icon:'FD', name:'Alimentação', spent: 980, limit: 1200 },
            { icon:'HS', name:'Moradia', spent: 1200, limit: 1200 }
        ]
    }
};

export function initDashboard() {
    console.log("Dashboard Inicializado");
}