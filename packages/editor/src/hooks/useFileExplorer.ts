import { useState, useEffect, useCallback } from "react";
import type { FileNode } from "@proton/shared";
import type { TreeItem, IconSpaceItem } from "@proton/ui";
import { filesApi } from "../api/files";
import { useProjectStore } from "../store/project_store";

export type ViewMode = "tile" | "tree";
