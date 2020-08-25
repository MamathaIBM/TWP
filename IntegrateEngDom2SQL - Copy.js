var express = require('express');
var request = require('request');
var https = require("https");
var mariadb = require('mariadb');
var moment = require('moment'); 
const config = require('./Config.json');
https.globalAgent.options.rejectUnauthorized = false;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ''; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ''; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ''); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ''; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ''; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } };
var pool = mariadb.createPool({
  connectionLimit: config.Server_mariadb_System.connectionLimit,
  host: config.Server_mariadb_System.host,
  port: config.Server_mariadb_System.dbPort,
  user: config.Server_mariadb_System.user,
  password: config.Server_mariadb_System.password,
  database: config.Server_mariadb_System.schema,
  timezone: config.Server_mariadb_System.timezone
});
//Getting the TTSsuport user ID and password from adimprifile
queryTTSSuport = "select * from adminprofile WHERE FieldCategoryName in ('ttstoolssupport@in.ibm.com','EngNotesView','EngScheAgent','EngTRANotesView')  ORDER BY Categoryvalues ASC";
TTSUesrID = '';
TTSUesrPassw = ''
pool.getConnection().then(conn => {
  conn.query(queryTTSSuport).then((queryTTSSuportR) => {
    EngNotesView = queryTTSSuportR[0]['Categoryvalues'];
    EngTRANotesView = queryTTSSuportR[1]['Categoryvalues'];
    EngScheAgent = queryTTSSuportR[2]['Categoryvalues'];
    TTSUesrID = queryTTSSuportR[3]['FieldCategoryName'];
    TTSUesrPassw = queryTTSSuportR[3]['Categoryvalues'];
    conn.end();
  })
    .catch(err => {
      //handle error
      conn.end();
    })
}).catch(err => {
  //not connected
});
//End
function DominoEng2SQLEng() {
  var options = {
    method: 'GET',
    url: EngNotesView,
    headers: { Authorization: 'Basic ' + Base64.encode(TTSUesrID + ':' + TTSUesrPassw) }
  };

  request(options, function (err, response, body) {
    var InsertArry = []
    var ResultJSON = JSON.parse(body)
    pool.getConnection().then(conn => {
      for (let i = 0; i < ResultJSON.length - 1; i++) {
        if (ResultJSON[i]['Fld_Integration_ID'] !== '' && 
        (ResultJSON[i]['Flag_TWP'] === '') || (ResultJSON[i]['Flag_TWP'] === undefined)) {
          InsertArry[0] = ResultJSON[i]['Fld_Integration_ID']
          InsertArry[1] = ResultJSON[i]['$188']
          InsertArry[2] = ResultJSON[i]['SiebelNo']
          InsertArry[3] = ResultJSON[i]['Sector']
          InsertArry[4] = ResultJSON[i]['Industry']
          InsertArry[5] = ResultJSON[i]['MMCoETeam']
          InsertArry[6] = ResultJSON[i]['Month']
          InsertArry[7] = ResultJSON[i]['Year']
          InsertArry[8] = ResultJSON[i]['$192']
          InsertArry[9] = ResultJSON[i]['Deal_Type']
          InsertArry[10] = ResultJSON[i]['AppProfile']
          InsertArry[11] = ResultJSON[i]['Technology']
          InsertArry[12] = ResultJSON[i]['KTType']
          InsertArry[13] = ResultJSON[i]['Contact']
          InsertArry[14] = ResultJSON[i]['GDCLocations']
          InsertArry[15] = ResultJSON[i]['Inflight']
          InsertArry[16] = ResultJSON[i]['TypeofTransition']
          InsertArry[17] = ResultJSON[i]['Workpad']
          InsertArry[18] = ResultJSON[i]['CAST']
          InsertArry[19] = ResultJSON[i]['Webex']
          InsertArry[20] = ''
          InsertArry[21] = ''
          InsertArry[22] = ''
          InsertArry[23] = ResultJSON[i]['Other_Tools']
          InsertArry[24] = ResultJSON[i]['DDproposed']
          InsertArry[25] = ResultJSON[i]['Vendor']
          InsertArry[26] = ResultJSON[i]['$193']
          InsertArry[27] = ResultJSON[i]['frmIndApproach']
          InsertArry[28] = ResultJSON[i]['frmLangReq']
          InsertArry[29] = ResultJSON[i]['Fld_KTFM']
          InsertArry[30] = ResultJSON[i]['fldClientReBadge']
          InsertArry[31] = ResultJSON[i]['Fld_Domain']
          strEngagementInsert = "insert into engagementprofile values (null,'" + InsertArry.join("','") + "')"
          conn.query(strEngagementInsert).then((Createesult) => {
            conn.end();
          })
            .catch(err => {
              //handle error
              conn.end();
            })
        } else if (ResultJSON[i]['TWP_Flag_Update'] === 'Yes') {
          IntegrationID = ResultJSON[i]['Fld_Integration_ID']
          ClientName = ResultJSON[i]['$188']
          SiebelNo = ResultJSON[i]['SiebelNo']
          Sector = ResultJSON[i]['Sector']
          Industry = ResultJSON[i]['Industry']
          OwningTTS = ResultJSON[i]['MMCoETeam']
          SolMonth = ResultJSON[i]['Month']
          Solyear = ResultJSON[i]['Year']
          AMSTCV = ResultJSON[i]['$192']
          Tier = ResultJSON[i]['Deal_Type']
          AppProfile = ResultJSON[i]['AppProfile']
          Technology = ResultJSON[i]['Technology']
          KTType = ResultJSON[i]['KTType']
          EngTeamContact = ResultJSON[i]['Contact']
          GDCLoc = ResultJSON[i]['GDCLocations']
          Inflightprojects = ResultJSON[i]['Inflight']
          TypeofTransition = ResultJSON[i]['TypeofTransition']
          Workpad = ResultJSON[i]['Workpad']
          CAST = ResultJSON[i]['CAST']
          Webex = ResultJSON[i]['Webex']
          iPAT = ''
          Cog = ''
          ImpactMethod = ''
          OtherTools = ResultJSON[i]['Other_Tools']
          DDProposed = ResultJSON[i]['DDproposed']
          IncumbentVendor = ResultJSON[i]['Vendor']
          TotalIBMFTE = ResultJSON[i]['$193']
          IndustryApproach = ResultJSON[i]['frmIndApproach']
          LanguageRequirement = ResultJSON[i]['frmLangReq']
          KT_FMCost = ResultJSON[i]['Fld_KTFM']
          Clientre_badge = ResultJSON[i]['fldClientReBadge']
          DomainTraining = ResultJSON[i]['Fld_Domain']
          queryUpdateTWP = "Update engagementprofile SET ClientName='" + ClientName
            + "',SiebelNo='" + SiebelNo
            + "',Sector='" + Sector
            + "',Industry='" + Industry
            + "',OwningTTS='" + OwningTTS
            + "',SolMonth='" + SolMonth
            + "',Solyear='" + Solyear
            + "',AMSTCV='" + AMSTCV
            + "',Tier='" + Tier
            + "',AppProfile='" + AppProfile
            + "',Technology='" + Technology
            + "',KTType='" + KTType
            + "',EngTeamContact='" + EngTeamContact
            + "',GDCLoc='" + GDCLoc
            + "',Inflightprojects='" + Inflightprojects
            + "',TypeofTransition='" + TypeofTransition
            + "',Workpad='" + Workpad
            + "',CAST='" + CAST
            + "',Webex='" + Webex
            + "',iPAT='" + iPAT
            + "',Cog='" + Cog
            + "',ImpactMethod='" + ImpactMethod
            + "',OtherTools='" + OtherTools
            + "',DDProposed='" + DDProposed
            + "',IncumbentVendor='" + IncumbentVendor
            + "',TotalIBMFTE='" + TotalIBMFTE
            + "',IndustryApproach='" + IndustryApproach
            + "',LanguageRequirement='" + LanguageRequirement
            + "',KT_FMCost='" + KT_FMCost
            + "',Clientre_badge='" + Clientre_badge
            + "',DomainTraining='" + DomainTraining
            + "' where IntegrationID='" + IntegrationID + "'"
          conn.query(queryUpdateTWP).then((UpdateResult) => {
            conn.end();
          })
            .catch(err => {
              //handle error
              conn.end();
            })
        }
      }
    }).catch(err => {
      //not connected
    });
  });
}
function DominoTRA2SQLTRA() {
  var options = {
    method: 'GET',
    url: EngTRANotesView,
    headers: { Authorization: 'Basic ' + Base64.encode(TTSUesrID + ':' + TTSUesrPassw) }
  };
  request(options, function (err, response, body) {
    var InsertArry = []
    var ResultJSON = JSON.parse(body)
    var dt=moment(new Date());
    var Risk_Catagory =  ['Client Requirements & Expectation',
                           'Project Scope & Commitment',
                           'Industry Specific Risks',
                           'Technical Environment',
                           'Network/Access Specific Risks',
                           'Transition Specific risks'];

    var Risk_Cat_Name =  ['CRE','PSC','ISR','TE','NASR','TSR'];
    var Risk_Loop =  [3,4,7,9,4,15];

    pool.getConnection().then(conn => {
      for (let i = 0; i < ResultJSON.length - 1; i++) {
        if (ResultJSON[i]['Fld_Integration_ID'] !== '') {
          var options = {
            method: 'GET',
            url: 'https://inmbzp5155.in.dst.ibm.com/Dev/TTS/TTSMetrics.nsf/api/data/documents/unid/'+ResultJSON[i]['@unid'],
            headers: { Authorization: 'Basic ' + Base64.encode(TTSUesrID + ':' + TTSUesrPassw) }
          };

          request(options, function (err, response, body) {
            var ResultJSONTRA = JSON.parse(response.body)
            if ((ResultJSONTRA['Fld_Integration_ID'] !== "") &&
            ((ResultJSONTRA['Flag_TWP'] === "")||(ResultJSONTRA['Flag_TWP'] === undefined))) {  
             for( let rc=0; rc< Risk_Catagory.length; rc++){ 
              for( let iT=1; iT<=Risk_Loop[rc]; iT++){
               InsertArry = []
               InsertArry[0] = ResultJSONTRA['Fld_Integration_ID']
               InsertArry[1] = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_RiskID_'+iT]
               InsertArry[2] = Risk_Catagory[rc]
               if((rc===4) || (rc===5)){
                 InsertArry[3] = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_RiskAtt_'+iT].replace(/'/g, "\\'")
               }else{
                 InsertArry[3] = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Riskatt_'+iT].replace(/'/g, "\\'")
               }
               InsertArry[4] = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_PMA_'+iT].replace(/'/g, "\\'")
               InsertArry[5] = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Remarks_'+iT].replace(/'/g, "\\'")
               InsertArry[6] = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_RSImpact_'+iT]
               InsertArry[7] = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_RSProb_'+iT]
               if(ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Applicable_'+iT]===undefined){
                InsertArry[8] = ""
               }else{
                InsertArry[8] = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Applicable_'+iT]
               }
               InsertArry[9] = moment([dt.year(), dt.month(), dt.date()]).format("YYYY-MM-DD")
               InsertArry[10] = moment([dt.year(), dt.month(), dt.date()]).format("YYYY-MM-DD")
               InsertArry[11] = ""
               InsertArry[12] = ""

               strEngagementTRAInsert = "insert into transition_risk_analyzer_eng_account values (null,'" + InsertArry.join("','") + "')"
               conn.query(strEngagementTRAInsert).then((Createresult) => {
                conn.end();
              })
                .catch(err => {
                  //handle error
                  conn.end();
                })
              }  
             }
            }else if (ResultJSONTRA['TWP_Flag_Update'] === "Yes") {
              for( let rc=0; rc< Risk_Catagory.length; rc++){ 
                for( let iT=1; iT<=Risk_Loop[rc]; iT++){
                 IntegrationID = ResultJSONTRA['Fld_Integration_ID']
                 Risk_ID = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_RiskID_'+iT]
                 Risk_Category = Risk_Catagory[rc]
                 if((rc===4) || (rc===5)){
                  Risk_Attribute = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_RiskAtt_'+iT].replace(/'/g, "\\'")
                 }else{
                  Risk_Attribute = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Riskatt_'+iT].replace(/'/g, "\\'")
                 }
                 Planned_Mitigation_Action = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_PMA_'+iT].replace(/'/g, "\\'")
                 Acc_specific_risk = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Remarks_'+iT].replace(/'/g, "\\'")
                 Risk_Impact = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_RSImpact_'+iT]
                 Risk_Probability = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_RSProb_'+iT]
                 if(ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Applicable_'+iT]===undefined){
                  Risk_Type = ""
                 }else{
                  Risk_Type = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Applicable_'+iT]
                 }
                 Risk_Type = ResultJSONTRA['Fld_'+Risk_Cat_Name[rc]+'_Applicable_'+iT]
                 CREATED_AT = moment([dt.year(), dt.month(), dt.date()]).format("YYYY-MM-DD")
                 LAST_UPDATED_AT = moment([dt.year(), dt.month(), dt.date()]).format("YYYY-MM-DD")
  
                 strEngagementTRAUpdate = "Update transition_risk_analyzer_eng_account SET Risk_Category='" + Risk_Category
                 + "',Risk_Attribute='" + Risk_Attribute
                 + "',Planned_Mitigation_Action='" + Planned_Mitigation_Action
                 + "',Acc_specific_risk='" + Acc_specific_risk
                 + "',Risk_Impact='" + Risk_Impact
                 + "',Risk_Probability='" + Risk_Probability
                 + "',Risk_Type='" + Risk_Type
                 + "',CREATED_AT='" + CREATED_AT
                 + "',LAST_UPDATED_AT='" + LAST_UPDATED_AT
                 + "' where Integration_ID='" + IntegrationID + "' AND Risk_ID='" + Risk_ID + "'"
                 conn.query(strEngagementTRAUpdate).then((UpdateResult) => {
                 conn.end();
               })
                 .catch(err => {
                   //handle error
                   conn.end();
                 })
              }  
             }
            }
          });  
         }
      }
    }).catch(err => {
      //not connected
    });
  });
}
setTimeout(() => {
  DominoEng2SQLEng()
}, 2000)
setTimeout(() => {
  DominoTRA2SQLTRA()
}, 2000)

//Calling Lotus agent for mail start
setTimeout(() => {
  var optionsMail = {
    method: 'GET',
    url: EngScheAgent,
    headers: { Authorization: 'Basic ' + Base64.encode(TTSUesrID + ':' + TTSUesrPassw) }
  };

  request(optionsMail, function (err, response, body) {
    console.log('Sent the mail')
  });
}, 8000)

//86400
// setInterval(Domino2SQL, 300000);
console.log(" listening to  port 4080")