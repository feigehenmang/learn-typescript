// import _ from "lodash";
declare function jQuery(selector: any): any;
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}
declare class Animal {
    public name: string;
    public constructor(name: string);
    public sayHi(): string;
}
declare namespace ECPCONFIG {
    interface PortalConfig {
        baseUrl: string;
        version: string;
        author: string;
    }
}
// declare function jQuery(domReadyCallBack: () => any): any;
// 声明文件
// console.log(_);
// $
jQuery(() => {
    let portal: ECPCONFIG.PortalConfig = {
        version: "0.01",
        author: "ld",
        baseUrl: "/"
    };
    jQuery("body").html("Hello Declare");
    const animal1: Animal = new Animal("Pig");
    animal1.sayHi();
    console.log(jQuery.ajax);
});

