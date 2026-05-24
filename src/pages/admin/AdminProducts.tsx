import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import AdminProductTable from '../../components/admin/AdminProductTable';
import AdminProductForm from '../../components/admin/AdminProductForm';

export default function AdminProduct() {
  const {
    products,
    categories,
    brands,
    isLoading,
    search,
    setSearch,
    selectedCatFilter,
    setSelectedCatFilter,
    selectedBrandFilter,
    setSelectedBrandFilter,
    page,
    setPage,
    totalPages,
    totalProducts,
    error,
    success,
    viewMode,
    setViewMode,
    name,
    sku,
    setSku,
    slug,
    setSlug,
    price,
    setPrice,
    discountPrice,
    setDiscountPrice,
    stock,
    setStock,
    isActive,
    setIsActive,
    sortOrder,
    setSortOrder,
    shortDesc,
    setShortDesc,
    description,
    setDescription,
    images,
    category,
    setCategory,
    brand,
    setBrand,
    summary,
    setSummary,
    tagsString,
    setTagsString,
    isBestSeller,
    setIsBestSeller,
    isNewArrival,
    setIsNewArrival,
    isFeatured,
    setIsFeatured,
    isHot,
    setIsHot,
    specGroups,
    isUploading,
    isSaving,
    handleSearchSubmit,
    handleOpenAddModal,
    handleOpenEditModal,
    handleImageUpload,
    handleRemoveImage,
    handleNameChange,
    handleAddGroup,
    handleUpdateGroupName,
    handleRemoveGroup,
    handleAddItem,
    handleUpdateItem,
    handleRemoveItem,
    handleSave,
    handleDelete,
    toggleStatus,
  } = useAdminProducts();

  if (viewMode === 'add' || viewMode === 'edit') {
    return (
      <div className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-950/20 text-red-400 text-sm font-semibold rounded-xl border border-red-900 animate-in fade-in duration-200">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <AdminProductForm
          viewMode={viewMode}
          setViewMode={setViewMode}
          name={name}
          sku={sku}
          setSku={setSku}
          slug={slug}
          setSlug={setSlug}
          price={price}
          setPrice={setPrice}
          discountPrice={discountPrice}
          setDiscountPrice={setDiscountPrice}
          stock={stock}
          setStock={setStock}
          isActive={isActive}
          setIsActive={setIsActive}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          shortDesc={shortDesc}
          setShortDesc={setShortDesc}
          description={description}
          setDescription={setDescription}
          images={images}
          isUploading={isUploading}
          isSaving={isSaving}
          categories={categories}
          brands={brands}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
          isBestSeller={isBestSeller}
          setIsBestSeller={setIsBestSeller}
          isNewArrival={isNewArrival}
          setIsNewArrival={setIsNewArrival}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          isHot={isHot}
          setIsHot={setIsHot}
          tagsString={tagsString}
          setTagsString={setTagsString}
          summary={summary}
          setSummary={setSummary}
          specGroups={specGroups}
          onNameChange={handleNameChange}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          onAddGroup={handleAddGroup}
          onUpdateGroupName={handleUpdateGroupName}
          onRemoveGroup={handleRemoveGroup}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onRemoveItem={handleRemoveItem}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/20 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/20 text-red-400 text-sm font-semibold rounded-xl border border-red-900 animate-in fade-in duration-200">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AdminProductTable
        products={products}
        categories={categories}
        brands={brands}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        selectedCatFilter={selectedCatFilter}
        setSelectedCatFilter={setSelectedCatFilter}
        selectedBrandFilter={selectedBrandFilter}
        setSelectedBrandFilter={setSelectedBrandFilter}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalProducts={totalProducts}
        onSearchSubmit={handleSearchSubmit}
        onOpenAddModal={handleOpenAddModal}
        onOpenEditModal={handleOpenEditModal}
        onDelete={handleDelete}
        onToggleStatus={toggleStatus}
      />
    </div>
  );
}
