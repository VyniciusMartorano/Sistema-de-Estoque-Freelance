import "./index.css";

import { MegaMenu } from "primereact/megamenu";
import { PanelMenu } from "primereact/panelmenu";
import { Sidebar } from "primereact/sidebar";
import { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import logo from "@/assets/logo.png";
import { AuthContext } from "@/context/AuthContext";
import { useSGCNavigate } from "@/useNavigate";
import { Helpers } from "@/utils/helpers";

import {
  ButtonToggleSidebar,
  HeaderIconsContainer,
  HeaderSidebar,
  SGCAvatar,
} from "./components";

export function AppLayout() {
  const [visible, setVisible] = useState(true);

  const isMale = true;

  const { isAuthenticated, user, menus } = useContext(AuthContext);
  const isLoading = false;

  const { navigate } = useSGCNavigate();
  const userLogged = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`;

  const end = (
    <div className="flex flex-row">
      <SGCAvatar isMale={isMale} userName={userLogged} />
    </div>
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleOpenSidebar = () => {
    setVisible((prev) => !prev);
  };

  if (menus) {
    Helpers.addNavigateToMenuItens(menus, (url) => navigate(url));
  }

  return (
    <div>
      {isLoading && (
        <div className="absolute z-[9999999] flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 ">
          <img alt="Logo" className="w-52 animate-bounce" src={logo} />
        </div>
      )}
      <div className="menu-desktop relative  h-screen">
        <div
          className={`menu-desktop fixed left-0 right-0 top-0 z-50 flex w-full flex-row items-center justify-between gap-4 bg-sgc-blue-primary pr-5 ${isLoading && "blur-xl"} ${visible ? "pl-[296px]" : "pl-[116px]"}`}
        >
          <ButtonToggleSidebar handleOpenSidebar={handleOpenSidebar} />
          <div className="menu-desktop flex flex-row">
            <HeaderIconsContainer />

            <SGCAvatar isMale={isMale} userName={userLogged} />
          </div>
        </div>

        <Sidebar
          visible
          dismissable={false}
          onHide={() => setVisible((prev) => !prev)}
          showCloseIcon={false}
          modal={false}
          header={<HeaderSidebar />}
          className={`${isLoading && "blur-xl"} menu-desktop`}
          style={{
            width: visible ? 280 : 100,
            transition: "width 0.2s ease-in-out",
          }}
        >
          <div className="mt-4 flex flex-col gap-2">
            <PanelMenu
              model={menus?.map((el) => {
                // Correção temporária: removendo o prefixo 'fas fa-' dos ícones do font-awesome
                el.icon = el.icon.replace("fas fa-", "");
                if (el.items) {
                  el.items = el.items.map((item) => {
                    item.icon = item.icon.replace("fas fa-", "");

                    if (item.items) {
                      item.items = item.items.map((subItem) => {
                        subItem.icon = subItem.icon.replace("fas fa-", "");
                        return subItem;
                      });
                    }
                    return item;
                  });
                }
                return el;
              })}
              className={` ${!visible ? "hideLabelItems" : "removePadding"}`}
            />
          </div>
        </Sidebar>

        <div
          className={`${visible ? "pl-[296px]" : "pl-[116px]"} p-4 pt-16 ${isLoading ? "blur-xl" : ""} menu-desktop`}
        >
          <Outlet />
        </div>
      </div>

      <div className="menu-mobile ">
        <MegaMenu
          model={menus}
          orientation="horizontal"
          end={end}
          breakpoint="960px"
          className="surface-0 shadow-2 rounded-none bg-sgc-blue-primary p-3"
        />
      </div>
      <div className="p-2">
        <Outlet />
      </div>
    </div>
  );
}
