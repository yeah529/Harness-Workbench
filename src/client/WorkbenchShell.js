import React from "react";
import { List } from "@phosphor-icons/react";
import { ProjectHome } from "./ProjectHome.js";
import { WorkbenchSessionShell } from "./WorkbenchSessionShell.js";
import { WorkbenchSidebar } from "./WorkbenchSidebar.js";
import { KnowledgeCenterPage } from "./KnowledgeBase.js";
import { SessionListPage } from "./SessionListPage.js";
import { DraftConversation, NewSessionDialog } from "./NewSessionDialog.js";
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
  const [newSessionOpen, setNewSessionOpen] = React.useState(false);
  const navigationTriggerRef = React.useRef(null);

  const navigate = function (page) {
    if (page === "home") navigation.openHome();
    else if (page === "knowledge") navigation.openKnowledge();
    else if (page === "sessions") navigation.openSessions();
    else if (page === "archive") navigation.openArchive();
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
    setNewSessionOpen(true);
  };
  const openNativeSettings = function () {
    closeDrawer();
    if (typeof document === "undefined") return;
    window.setTimeout(function () {
      document.querySelector('[data-slot="sidebar.settings"] > button')?.click?.();
    }, 0);
  };

  const activeEntry = state.workbenchSessions?.[view.sessionId]
    || state.recentSessions?.find?.((item) => item.sessionId === view.sessionId)
    || null;
  const currentScope = state.draft?.scope ?? activeEntry?.scope ?? null;
  const currentContainerName = currentScope?.kind === "project"
    ? state.projects?.find?.((item) => item.id === currentScope.id)?.name
    : currentScope?.kind === "knowledge_base"
      ? state.knowledgeBases?.find?.((item) => item.id === currentScope.id)?.name
      : activeEntry?.title || activeEntry?.displayTitle || "当前独立会话";

  React.useEffect(function () {
    if (!currentScope || (view.page !== "conversation" && view.page !== "draft")) return;
    props.store.actions.loadScopeSessions?.(currentScope).catch(function () {});
  }, [currentScope?.kind, currentScope?.id, props.store, view.page, view.sessionId]);

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
      onArchive: async () => {
        await props.store.actions.archiveSession(view.sessionId);
        navigation.openArchive();
      },
      onRestore: async () => {
        await props.store.actions.restoreSession(view.sessionId);
      },
    });
  } else if (view.page === "draft") {
    center = React.createElement(DraftConversation, {
      store: props.store,
      onActivated: props.openActivatedSession,
      onCancel() {
        props.store.actions.discardDraft();
        navigation.openHome();
      },
    });
  } else if (view.page === "knowledge") {
    center = React.createElement(KnowledgeCenterPage, {
      store: props.store,
      sessions: props.sessions,
      workspaces: props.workspaces,
      onConversationOpen: navigation.openConversation,
      onDraftOpen: navigation.openDraft,
    });
  } else if (view.page === "sessions") {
    center = React.createElement(SessionListPage, { store: props.store, onOpenSession: openSession });
  } else if (view.page === "archive") {
    center = React.createElement(SessionListPage, { archived: true, store: props.store, onOpenSession: openSession });
  } else {
    center = React.createElement(ProjectHome, { ...props, open: true });
  }

  const sidebarSessions = [...(state.scopeSessionPage?.items || []), ...(state.recentSessions || [])]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.sessionId === item.sessionId) === index);
  const sidebar = React.createElement(WorkbenchSidebar, {
      page: view.page,
      activeSessionId: view.sessionId,
      recentSessions: sidebarSessions,
      currentScope: view.page === "conversation" || view.page === "draft" ? currentScope : null,
      currentContainerName,
      currentContainerTotal: currentScope?.kind === "independent" ? (view.sessionId ? 1 : 0) : state.scopeSessionPage?.total || 0,
      onNavigate: navigate,
      onNewSession: createSession,
      onOpenSession: openSession,
      mobile: layoutMode === "mobile",
      settingsTrigger: openNativeSettings,
    });

  const dialogScope = currentScope ?? { kind: "independent", id: null };

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
    React.createElement("section", { className: "cpwb-workbench-stage" }, center),
    React.createElement(NewSessionDialog, {
      open: newSessionOpen,
      store: props.store,
      initialScope: dialogScope,
      onClose: () => setNewSessionOpen(false),
      onStart(input) {
        props.store.actions.startDraft(input);
        setNewSessionOpen(false);
        navigation.openDraft();
      },
    }));
}
