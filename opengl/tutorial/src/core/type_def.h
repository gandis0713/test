#ifndef TYPE_DEF_H
#define TYPE_DEF_H

#if defined(__GNUC__) && (__GNUC__ >= 4)
    #define __FORCE_INLINE__ __attribute__((always_inline)) inline
#elif defined(__llvm__)
    #define __FORCE_INLINE__ __attribute__((always_inline)) inline
#elif defined(_MSC_VER)
    #define __FORCE_INLINE__ __forceinline
#else
    #define __FORCE_INLINE__ inline
#endif

#ifdef USE_FORCE_INLINE
    #define __INLINE__ __FORCE_INLINE__
#else
    #define __INLINE__ inline
#endif // USE_FORCE_INLINE

#endif // TYPE_DEF_H