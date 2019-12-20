#ifndef TYPE_DEF_H
#define TYPE_DEF_H

#define INLINE inline
#define USE_FORCE_INLINE

#ifdef USE_FORCE_INLINE
    #if defined(__GNUC__) && (__GNUC__ >= 4)
    #define INLINE __attribute__((always_inline)) inline
    #elif defined(__llvm__)
    #define INLINE __attribute__((always_inline)) inline
    #elif defined(_MSC_VER)
    #define INLINE __forceinline
    #endif
#endif

#endif