import React from "react";
import { List } from "@phosphor-icons/react";
import { ProjectHome } from "./ProjectHome.js";
import { WorkbenchSessionShell } from "./WorkbenchSessionShell.js";
import { WorkbenchSidebar } from "./WorkbenchSidebar.js";
import { KnowledgeCenterPage } from "./KnowledgeCenterPage.js";
import { SessionListPage } from "./SessionListPage.js";
import { DraftConversation, NewSessionDialog } from "./NewSessionDialog.js";
import { MaintenanceScreen, readStoredMaintenanceJob } from "./MaintenanceScreen.js";
import { DrawerDialog, nextDrawerOwner, useWorkbenchLayoutMode } from "./responsive.js";
import { DEFAULT_TIME_ZONE } from "./timezone.js";

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
  const [sessionListScope, setSessionListScope] = React.useState(null);
  const navigationTriggerRef = React.useRef(null);

  React.useEffect(function () {
    if (state.maintenanceJob || typeof props.store.actions.resumePurgeJob !== "function") return;
    const stored = readStoredMaintenanceJob();
    if (stored?.jobId) void props.store.actions.resumePurgeJob(stored.jobId);
  }, [props.store, state.maintenanceJob]);

  const navigate = function (page) {
    if (page === "home") navigation.openHome();
    else if (page === "knowledge") navigation.openKnowledge();
    else if (page === "sessions") { setSessionListScope(null); navigation.openSessions(); }
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
  const archiveSession = async function (sessionId) {
    await props.store.actions.archiveSession(sessionId);
    if (view.sessionId === sessionId) navigation.openSessions();
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
      opening: view.opening === true,
      openError: view.error || null,
      onRetryOpen: () => props.openSession?.(view.sessionId),
      onHome: navigation.openHome,
      layoutMode,
      projectDrawerOpen: drawerOwner === "project",
      onProjectDrawerOpen: () => openDrawer("project"),
      onProjectDrawerClose: closeDrawer,
    });
  } else if (view.page === "draft") {
    center = React.createElement(DraftConversation, {
      store: props.store,
      sessions: props.sessions,
      workspaces: props.workspaces,
      connection: props.connection,
      conversation: props.conversation,
      onActivated: props.openActivatedSession,
      onCancel() {
        Promise.resolve(props.store.actions.discardDraft()).finally(navigation.openHome);
      },
    });
  } else if (view.page === "knowledge") {
    center = React.createElement(KnowledgeCenterPage, {
      store: props.store,
      onDraftOpen: navigation.openDraft,
    });
  } else if (view.page === "sessions") {
    center = React.createElement(SessionListPage, { store: props.store, onOpenSession: openSession, initialScope: sessionListScope });
  } else {
    center = React.createElement(ProjectHome, {
      ...props,
      open: true,
      openProjectSessions(project) {
        setSessionListScope({ kind: "project", id: project.id, name: project.name });
        navigation.openSessions();
      },
    });
  }

  const sidebar = React.createElement(WorkbenchSidebar, {
      page: view.page,
      activeSessionId: view.sessionId,
      recentSessions: state.recentSessions,
      onNavigate: navigate,
      onNewSession: createSession,
      onOpenSession: openSession,
      onArchiveSession: (sessionId) => archiveSession(sessionId).catch(function () {}),
      timeZone: state.settings?.timezone || DEFAULT_TIME_ZONE,
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
    }),
    state.maintenanceJob
      ? React.createElement(MaintenanceScreen, {
          store: props.store,
          job: state.maintenanceJob,
          onFinished() {
            setSessionListScope(null);
            navigation.openHome();
          },
        })
      : null);
}
