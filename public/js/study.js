// JavaScript Document

function surveyGo1()
  {
    var p1 = document.prinsert1;

    if(p1.pname.value==""){
     alert("이름을 입력해 주세요.");
    p1.pname.focus();
      return;
    }
    if(p1.phone.value==""){
     alert("휴대폰 번호를 정확히 입력해 주세요.");
    p1.phone.focus();
      return;
    }
    
    for (i=0; i<p1.phone.value.length; i++)
       {
         var ch = p1.phone.value.charAt(i);//문자를 반환(정수형), 범위 검사 가능
      if ( ch < "0" || ch > "9" )
         {
              alert("휴대폰 번호는 숫자로만 입력 가능 합니다!");
              p1.phone.focus();
              return;
           }
        }


    if(!p1.check1.checked){
                alert("서비스 이용약관에 동의하셔야 신청이 가능합니다."); 
                return;
         
        }else if(p1.check1.checked){
          if(!p1.check2.checked){
                alert("개인정보 수집 및 이용 동의하셔야 신청이 가능합니다.");
                return;
        }
      }

    //alert("참여해 주셔서 감사합니다.")
    p1.submit();
  }
 
function surveyGo2()
  {
    var p1 = document.prinsert2;

    if(p1.pname.value==""){
     alert("이름을 입력해 주세요.");
    p1.pname.focus();
      return;
    }
    if(p1.phone.value==""){
     alert("휴대폰 번호를 정확히 입력해 주세요.");
    p1.phone.focus();
      return;
    }
    
    for (i=0; i<p1.phone.value.length; i++)
       {
         var ch = p1.phone.value.charAt(i);//문자를 반환(정수형), 범위 검사 가능
      if ( ch < "0" || ch > "9" )
         {
              alert("휴대폰 번호는 숫자로만 입력 가능 합니다!");
              p1.phone.focus();
              return;
           }
        }


    if(!p1.check1.checked){
                alert("서비스 이용약관에 동의하셔야 신청이 가능합니다."); 
                return;
         
        }else if(p1.check1.checked){
          if(!p1.check2.checked){
                alert("개인정보 수집 및 이용 동의하셔야 신청이 가능합니다.");
                return;
        }
      }

    //alert("참여해 주셔서 감사합니다.")
    p1.submit();
  }
 
function surveyGo3()
  {
    var p1 = document.prinsert3;

    if(p1.pname.value==""){
     alert("이름을 입력해 주세요.");
    p1.pname.focus();
      return;
    }
    if(p1.phone.value==""){
     alert("휴대폰 번호를 정확히 입력해 주세요.");
    p1.phone.focus();
      return;
    }
    
    for (i=0; i<p1.phone.value.length; i++)
       {
         var ch = p1.phone.value.charAt(i);//문자를 반환(정수형), 범위 검사 가능
      if ( ch < "0" || ch > "9" )
         {
              alert("휴대폰 번호는 숫자로만 입력 가능 합니다!");
              p1.phone.focus();
              return;
           }
        }


    if(!p1.check1.checked){
                alert("서비스 이용약관에 동의하셔야 신청이 가능합니다."); 
                return;
         
        }else if(p1.check1.checked){
          if(!p1.check2.checked){
                alert("개인정보 수집 및 이용 동의하셔야 신청이 가능합니다.");
                return;
        }
      }

    //alert("참여해 주셔서 감사합니다.")
    p1.submit();
  }
 
function surveyGo4()
  {
    var p1 = document.prinsert4;

    if(p1.pname.value==""){
     alert("이름을 입력해 주세요.");
    p1.pname.focus();
      return;
    }
    if(p1.phone.value==""){
     alert("휴대폰 번호를 정확히 입력해 주세요.");
    p1.phone.focus();
      return;
    }
    
    for (i=0; i<p1.phone.value.length; i++)
       {
         var ch = p1.phone.value.charAt(i);//문자를 반환(정수형), 범위 검사 가능
      if ( ch < "0" || ch > "9" )
         {
              alert("휴대폰 번호는 숫자로만 입력 가능 합니다!");
              p1.phone.focus();
              return;
           }
        }


    if(!p1.check1.checked){
                alert("서비스 이용약관에 동의하셔야 신청이 가능합니다."); 
                return;
         
        }else if(p1.check1.checked){
          if(!p1.check2.checked){
                alert("개인정보 수집 및 이용 동의하셔야 신청이 가능합니다.");
                return;
        }
      }

    //alert("참여해 주셔서 감사합니다.")
    p1.submit();
  }

function surveyGo5()
  {
    var p1 = document.prinsert5;

    if(p1.pname.value==""){
     alert("이름을 입력해 주세요.");
    p1.pname.focus();
      return;
    }
    if(p1.phone.value==""){
     alert("휴대폰 번호를 정확히 입력해 주세요.");
    p1.phone.focus();
      return;
    }
    
    for (i=0; i<p1.phone.value.length; i++)
       {
         var ch = p1.phone.value.charAt(i);//문자를 반환(정수형), 범위 검사 가능
      if ( ch < "0" || ch > "9" )
         {
              alert("휴대폰 번호는 숫자로만 입력 가능 합니다!");
              p1.phone.focus();
              return;
           }
        }


    if(!p1.check1.checked){
                alert("서비스 이용약관에 동의하셔야 신청이 가능합니다."); 
                return;
         
        }else if(p1.check1.checked){
          if(!p1.check2.checked){
                alert("개인정보 수집 및 이용 동의하셔야 신청이 가능합니다.");
                return;
        }
      }

    //alert("참여해 주셔서 감사합니다.")
    p1.submit();
  }

function surveyGo6()
  {
    var p1 = document.prinsert6;

    if(p1.pname.value==""){
     alert("이름을 입력해 주세요.");
    p1.pname.focus();
      return;
    }
    if(p1.phone.value==""){
     alert("휴대폰 번호를 정확히 입력해 주세요.");
    p1.phone.focus();
      return;
    }
    
    for (i=0; i<p1.phone.value.length; i++)
       {
         var ch = p1.phone.value.charAt(i);//문자를 반환(정수형), 범위 검사 가능
      if ( ch < "0" || ch > "9" )
         {
              alert("휴대폰 번호는 숫자로만 입력 가능 합니다!");
              p1.phone.focus();
              return;
           }
        }


    if(!p1.check1.checked){
                alert("서비스 이용약관에 동의하셔야 신청이 가능합니다."); 
                return;
         
        }else if(p1.check1.checked){
          if(!p1.check2.checked){
                alert("개인정보 수집 및 이용 동의하셔야 신청이 가능합니다.");
                return;
        }
      }

    //alert("참여해 주셔서 감사합니다.")
    p1.submit();
  }

function surveyGo7()
  {
    var p1 = document.prinsert7;

    if(p1.pname.value==""){
     alert("이름을 입력해 주세요.");
    p1.pname.focus();
      return;
    }
    if(p1.phone.value==""){
     alert("휴대폰 번호를 정확히 입력해 주세요.");
    p1.phone.focus();
      return;
    }
    
    for (i=0; i<p1.phone.value.length; i++)
       {
         var ch = p1.phone.value.charAt(i);//문자를 반환(정수형), 범위 검사 가능
      if ( ch < "0" || ch > "9" )
         {
              alert("휴대폰 번호는 숫자로만 입력 가능 합니다!");
              p1.phone.focus();
              return;
           }
        }


    if(!p1.check1.checked){
                alert("서비스 이용약관에 동의하셔야 신청이 가능합니다."); 
                return;
         
        }else if(p1.check1.checked){
          if(!p1.check2.checked){
                alert("개인정보 수집 및 이용 동의하셔야 신청이 가능합니다.");
                return;
        }
      }

    //alert("참여해 주셔서 감사합니다.")
    p1.submit();
  }