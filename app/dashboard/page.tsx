"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import axios from "axios";

type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
};

export default function Dashboard() {
    const router = useRouter();
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAdd, setShowAdd] = useState(false)
    const [addForm, setAddForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        isAvailable: true,
    })
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        isAvailable: true,
    })

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("token", token)
            router.replace("/login");
            return;
        }

        async function loadMenu() {
            try {
                const response = await api.get("/api/menu");
                console.log("datas: ", response)
                setMenu(response.data.data);
            } catch {
                setError("Could not load the menu");
            } finally {
                setLoading(false);
            }
        }

        loadMenu();
    }, [router]);

    function handleLogout() {
        localStorage.removeItem("token");
        router.push("/login");
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?"))
            return;
        try {
            const response = await api.delete(`/api/menu/${id}`)
            setMenu((prev) => prev.filter((item) => item.id !== id))
            console.log("Delete response", response)
            alert(response.data.message);

        } catch (error) {
            console.error(error)


            if (axios.isAxiosError(error)) {
                console.log("status:", error.response?.status);
                console.log("server message:", error.response?.data?.message);
            }
        }

    }

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item)
        setForm({
            name: item.name,
            description: item.description,
            price: String(item.price),
            category: item.category,
            isAvailable: item.isAvailable,
        })

    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("save clicked", editingItem?.id, form);
        if (!editingItem)
            return;
        try {
            const response = await api.put(`/api/menu/${editingItem.id}`, { ...form, price: Number(form.price) })

            setMenu((prev) =>
                prev.map((item) =>
                    item.id === editingItem.id
                        ? { ...item, ...form, price: Number(form.price) }
                        : item
                )
            );
            console.log("response", response)
            setEditingItem(null)
            alert(response.data.message || "Updated")

        }
        catch (error) {
            console.error('err message', error)
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Could not update the item")
            }

        }


    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await api.post(`/api/menu`, { ...addForm, price: Number(addForm.price) })
            console.log("handleAdd response", response)
            setMenu((prev) => [...prev, response.data.data])
            setShowAdd(false)
            setAddForm({ name: "", description: "", price: "", category: "", isAvailable: true })
            alert(response.data.message || "Item added")

        }
        catch (error) {
            console.error("error", error)
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Could not add the item")
            }
        }
    }
    console.log("editingItem:", editingItem);
    console.log("addForm:", addForm);

    return (
        <div className="min-h-screen bg-stone-100 text-stone-900">
            {/* Top bar */}
            <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-sm font-bold text-white">
                            R
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-base font-semibold tracking-tight">RestoDash</h1>
                            <p className="text-xs text-stone-500">Menu management</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
                    >
                        Log out
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                {/* Page heading + summary */}
                <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">Your menu</h2>
                        <p className="mt-1 text-sm text-stone-500">
                            Review, edit and remove the dishes customers see.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAdd(true)}
                        className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
                    >
                        Add item
                    </button>


                    {!loading && !error && (
                        <dl className="flex divide-x divide-stone-300 overflow-hidden rounded-xl border border-stone-200 bg-white">
                            <div className="px-5 py-3">
                                <dt className="text-xs text-stone-500">Total items</dt>
                                <dd className="text-2xl font-semibold tabular-nums">{menu.length}</dd>
                            </div>
                            <div className="px-5 py-3">
                                <dt className="text-xs text-stone-500">Available</dt>
                                <dd className="text-2xl font-semibold tabular-nums text-emerald-800">
                                    {menu.filter((item) => item.isAvailable).length}
                                </dd>
                            </div>
                            <div className="px-5 py-3">
                                <dt className="text-xs text-stone-500">Unavailable</dt>
                                <dd className="text-2xl font-semibold tabular-nums text-amber-700">
                                    {menu.filter((item) => !item.isAvailable).length}
                                </dd>
                            </div>
                        </dl>
                    )}
                </div>

                {showAdd && (
                    <form onSubmit={handleAdd} className="mb-8 rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 w-100">
                        <h3 className="text-xl font-semibold tracking-tight">New menu item</h3>

                        <label className="mt-5 block text-sm font-medium text-stone-700">
                            Name
                            <input
                                value={addForm.name}
                                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                            />
                        </label>
                        <label className="mt-5 block text-sm font-medium text-stone-700">
                            Description
                            <input
                                value={addForm.description}
                                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                            />
                        </label>
                        <label className="mt-5 block text-sm font-medium text-stone-700">
                            Category
                            <input
                                value={addForm.category}
                                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                            />
                        </label>
                        <label className="mt-5 block text-sm font-medium text-stone-700">
                            Price
                            <input
                                type="number"
                                value={addForm.price}
                                onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                            />
                        </label>
                        <label className="mt-5 flex items-center gap-3 text-sm font-medium text-stone-700">
                            Available to customers
                            <input
                                type="checkbox"
                                checked={addForm.isAvailable}
                                onChange={(e) => setAddForm({ ...addForm, isAvailable: e.target.checked })}
                                className="h-4 w-4 accent-emerald-800 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                            />
                        </label>

                        <div className="mt-5 flex gap-3">
                            <button
                                type="submit"
                                className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                            >
                                Add to menu
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAdd(false)}
                                className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
                {/* Edit panel */}
                {editingItem && (
                    <form
                        onSubmit={handleUpdate}
                        className="mb-8 overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm w-100"
                    >

                        <div className="border-l-4 border-emerald-800 p-5 sm:p-6">
                            <p className="text-sm text-stone-500">Editing</p>
                            <h3 className="text-xl font-semibold tracking-tight">{editingItem.name}</h3>

                            <label className="mt-5 block text-sm font-medium text-stone-700">
                                Name
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                                />
                            </label>
                            <label className="mt-5 block text-sm font-medium text-stone-700">
                                Description
                                <input
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                                />
                            </label>
                            <label className="mt-5 block text-sm font-medium text-stone-700">
                                category
                                <input
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                                />
                            </label>
                            <label className="mt-5 block text-sm font-medium text-stone-700">
                                Price
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                                />
                            </label>
                            <label className="mt-5 flex items-center gap-3 text-sm font-medium text-stone-700">
                                Available to customers
                                <input
                                    type="checkbox"
                                    checked={form.isAvailable}
                                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                                    className="h-4 w-4 rounded border-stone-300 accent-emerald-800"
                                />

                            </label>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 cursor-pointer"
                                >
                                    Save changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* States */}
                {loading && (
                    <div className="rounded-xl border border-stone-200 bg-white p-6">
                        <p className="text-sm text-stone-500">Loading your menu…</p>
                        <div className="mt-4 space-y-3">
                            {[0, 1, 2, 3].map((n) => (
                                <div key={n} className="h-10 animate-pulse rounded-lg bg-stone-100" />
                            ))}
                        </div>
                    </div>
                )}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Menu table */}
                {!loading && !error && (
                    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">Name</th>
                                        <th className="px-5 py-3 font-medium">Category</th>
                                        <th className="px-5 py-3 font-medium">Price</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">Description</th>
                                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {menu.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-12 text-center text-stone-500">
                                                No menu items yet.
                                            </td>
                                        </tr>
                                    )}
                                    {menu.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={
                                                editingItem?.id === item.id
                                                    ? "bg-emerald-50/60"
                                                    : "transition-colors hover:bg-stone-50"
                                            }
                                        >
                                            <td className="px-5 py-4 font-medium text-stone-900">{item.name}</td>
                                            <td className="px-5 py-4">
                                                <span className="inline-block rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-medium tabular-nums">
                                                ₦{item.price?.toLocaleString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={
                                                        item.isAvailable
                                                            ? "inline-flex items-center gap-2 text-emerald-800"
                                                            : "inline-flex items-center gap-2 text-amber-700"
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            item.isAvailable
                                                                ? "h-2 w-2 rounded-full bg-emerald-600"
                                                                : "h-2 w-2 rounded-full bg-amber-500"
                                                        }
                                                    />
                                                    {item.isAvailable ? "Available" : "Unavailable"}
                                                </span>
                                            </td>
                                            <td className="max-w-xs truncate px-5 py-4 text-stone-500">
                                                {item.description}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">


                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:border-emerald-700 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}