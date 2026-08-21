import React from "react";
import { List } from "@phosphor-icons/react";
import { ProjectHome } from "./ProjectHome.js";
import { WorkbenchSessionShell } from "./WorkbenchSessionShell.js";
import { WorkbenchSidebar } from "./WorkbenchSidebar.js";
import { KnowledgeCenterPage } from "./KnowledgeBase.js";
import { SessionListPage } from "./SessionListPage.js";
import { DrawerDialog, nextDrawerOwner, useWorkbenchLayoutMode } from "./responsive.js";

export function WorkbenchShell(props) {
  const navigation = props.navigation;
  const view = React.useSyncExternalStore(
    navigation.subscribe,
    navigation.getSnapshot,
    navigation.getSnapshot,
  );
  const state = React.useSyncExternalStore(props.store.subscribe, props.store.getSnapshot, props.store.getSnapshot);
  const layoutMode = useWorkbenchLayoutMode(props.layoutMode);
  const [drawerOwner, setDrawerOwner] = React.useState(null);
  const navigationTriggerRef = React.useRef(null);

  const navigate = function (page) {
    if (page === "home") navigation.openHome();
    else if (page === "knowledge") navigation.openKnowledge();
    else if (page === "sessions") navigation.openSessions();
    if (layoutMode === "mobile") setDrawerOwner(null);
  };
  const openDrawer = function (owner) { setDrawerOwner((current) => nextDrawerOwner(current, owner)); };
  const closeDrawer = function () { setDrawerOwner(null); };
  const openSession = function (sessionId) {
    if (layoutMode === "mobile") closeDrawer();
    return props.openSession?.(sessionId);
  };
  const createSession = function () {
    if (layoutMode === "mobile") closeDrawer();
    return props.createSession?.();
  };
  const openNativeSettings = function () {
    closeDrawer();
    if (typeof document === "undefined") return;
    window.setTimeout(function () {
      document.querySelector('[data-slot="sidebar.settings"] > button')?.click?.();
    }, 0);
  };

  React.useEffect(function () {
    if (view.page !== "conversation" && drawerOwner === "project") closeDrawer();
    if (layoutMode !== "mobile" && drawerOwner === "navigation") closeDrawer();
    if (layoutMode === "desktop" && drawerOwner === "project") closeDrawer();
  }, [drawerOwner, layoutMode, view.page]);
  let center;

  if (view.page === "conversation") {
    center = React.createElement(WorkbenchSessionShell, {
      ...props,
      open: true,
      globalSidebar: true,
      sessionId: view.sessionId,
      onHome: navigation.openHome,
      layoutMode,
      projectDrawerOpen: drawerOwner === "project",
      onProjectDrawerOpen: () => openDrawer("project"),
      onProjectDrawerClose: closeDrawer,
    });
  } else if (view.page === "knowledge") {
    center = React.createElement(KnowledgeCenterPage, {
      store: props.store,
      sessions: props.sessions,
      workspaces: props.workspaces,
      onConversationOpen: navigation.openConversation,
    });
  } else if (view.page === "sessions") {
    center = React.createElement(SessionListPage, { store: props.store, onOpenSession: openSession });
  } else {
    center = React.createElement(ProjectHome, { ...props, open: true });
  }

  const sidebar = React.createElement(WorkbenchSidebar, {
      page: view.page,
      activeSessionId: view.sessionId,
      recentSessions: state.recentSessions,
      onNavigate: navigate,
      onNewSession: createSession,
      onOpenSession: openSession,
      mobile: layoutMode === "mobile",
      settingsTrigger: openNativeSettings,
    });

  return React.createElement("div", {
    className: "cpwb-app-shell cpwb-layout-" + layoutMode,
    "data-page": view.page,
    "data-navigation-open": drawerOwner === "navigation" ? "true" : "false",
  },
    layoutMode === "mobile"
      ? React.createElement(React.Fragment, null,
        React.createElement("button", {
          ref: navigationTriggerRef,
          type: "button",
          className: "cpwb-mobile-nav-trigger",
          "aria-label": "打开导航",
          "aria-expanded": drawerOwner === "navigation",
          onClick: () => openDrawer("navigation"),
        }, React.createElement(List, { size: 21, "aria-hidden": true })),
        React.createElement(DrawerDialog, {
          open: drawerOwner === "navigation",
          onClose: closeDrawer,
          label: "Workbench 导航",
          side: "left",
          triggerRef: navigationTriggerRef,
        }, sidebar))
      : sidebar,
    React.createElement("section", { className: "cpwb-workbench-stage" }, center));
}
